# Anbindung AWS via STS

## Systembild

![](images/interaction-diagram.png)

## ToDos um ein neues Zielprojekt in der AWS anzubinden

### Todos im Zielprojekt
In den AWS-Zielprojekten muss über _Cloudformation_ ein Stack angelegt werden, der die Rolle _ccf_ mit den entsprechenden Rechten anlegt. Das YAML-Cloudformation-File findet sich unter `cloudformation/ccf-osp.yaml` 

### Todos in CCF-Tool 
Der Wert der Umgebungsvariable `AWS_ACCOUNTS` muss geändert werden. Konkret muss das ein weiterer JSON-Eintrag für das neue Zielprojekt ins Array aufgenommen werden. 

`vorher: AWS_ACCOUNTS=[{"id":"604377753411","name":"Projekt 1"}]`

`nachher: AWS_ACCOUNTS=[{"id":"604377753411","name":"Projekt 1"},{"id":"123456789012","name":"Projekt 2"}]`

Ermittlung der Account-ID im Zielprojekt(in der Console oben rechts Account auswählen)
![](images/account_id_zielaws.png)

## Schritt 1. Get Google-Token

Das Folgende war nur relevant während der Debug-Phase, als die Anbindung noch nicht lief. Ein Problem war,dass in der Umgebung die Umgebungsvariable `GOOGLE_APPLICATION_CREDENTIALS_CONTENT` gesetzt sein musste. Ansonsten schlug der Aufruf fehl. Die Lösung war, in github-Secrets zwei neue Variablen anzulegen, GOOGLE_APLICATION_CREDENTIALS und GOOGLE_APPLICATION_CREDENTIALS_CONTENT, die den  Dateinamen der Credentials und Inhalt der Datei beinhalten, und die im Buildprozess zu ensprechenden Einträgen in der `.env` Datei der Anwendung führen.

Wie kann man den Inhalt des Tokens ermitteln?

### Ermittlung des Tokens über lokalen curl-Aufruf

``
    curl -X POST -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) -H "Content-Type: application/json; charset=utf-8" -d @request.json "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/ccf-app@ogcs-btqm-osphub.iam.gserviceaccount.com:generateIdToken"
``

wobei der Inhalt der Datei request.json ist:

``

    {
        "audience": "ccf-app@ogcs-btqm-osphub.iam.gserviceaccount.com",
        "includeEmail": "true"
    }

``

Ergebnis sollte ein JWT-Token sein, der Art:

``

        {
            "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6LCJ0eXAiOiJKV1QifQ...."
        }

`
### Ermittlung des Tokens über Debug-Eintrag

In der Source-Datei `packages/aws/src/application/GCPCredentials.ts`
kann man eine DEBUG-Zeile in der Methode `referesh` einfügen über:

`console.log(`DEBUG got token: ${token}`)`

`token` wird im Konstruktor von `ChainableTemporaryCredentials` genutzt.

### Betrachten des Inhalts über https://jwt.io 

Über die Webseite https://jwt.io kann man sich den Tokeninhalt anschauen.

Interessant sind die Werte für die "aud", "azp", "iss", "sub" Einträge,
denn diese müssen zu den entsprechenden Einträgen in der Policy für den proxy-Account passen.

Dabei gilt folgendes Matching:

https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_iam-condition-keys.html#ck_aud

| Google-Token-Wert | Policy-Wert in AWS-Proxy-Account | konkreter Wert                                   |
|-------------------|------------|--------------------------------------------------|
| sub               | "accounts.google.com:sub" | 111...134   (21-stellig)                         |
| azp               | "accounts.google.com:aud":" | 111...134  (wie azp)                           |
| aud               | "accounts.google.com:oaud" | ccf-app@ogcs-btqm-osphub.iam.gserviceaccount.com |

## Schritt 2. Hole temporären Token aus AWS

Mittels des unter 1. geholten Google-JWT-Tokens kann nun AWS angesprochen werden.
Auch diesen Schritt kann man manuell simulieren.

Ich habe dazu die foglende POSTMAN Abfrage genutzt:

https://sts.amazonaws.com/?DurationSeconds=901&Action=AssumeRoleWithWebIdentity&Version=2011-06-15&RoleSessionName=ccfproxy&RoleArn=arn:aws:iam::494038884865:role/ccfproxy&WebIdentityToken=<token-value...eyJhbGci...YYXa-g>

Ergebnis war ein XML-Dokument

`

    <AssumeRoleWithWebIdentityResponse xmlns="https://sts.amazonaws.com/doc/2011-06-15/">
        <AssumeRoleWithWebIdentityResult>
            <Audience>111...134</Audience>
            <AssumedRoleUser>
                <AssumedRoleId>AROAXGBYDEIAXJBP7UI65:ccfproxy</AssumedRoleId>
                <Arn>arn:aws:sts::494038884865:assumed-role/ccfproxy/ccfproxy</Arn>
            </AssumedRoleUser>
            <Provider>accounts.google.com</Provider>
            <Credentials>
                <AccessKeyId>ASIAXGBYDEIAR7RTV5EE</AccessKeyId>
                    <SecretAccessKey>gKO...cMn</SecretAccessKey>                                            <SessionToken>FwoGZXIvYXdzEHAaDMEzTxjJQFCWvrbSaiLRAfzznjOdWFPS8IINF3elJUk1KhqPTnnTBhoDjZuhZ/sacM3wFTAPNAlNB3KruzFB+xB/0PSsTGrxjlYhlInbiNqJeOkrjwkKtr6zDHTALl1zQ/AimuzyDzdAPgzZgJ/JBx7DLTNcrAGljbKtDLh56+5eDuFNHITkKjsGauJ/rtNVieDFa+uVg1VQwIO8VYAkkxh7cbUCRbW55w+PYO/ZfFTcFBNrUCJWKcMDoWuaHfVvKcmyXhOVR8ynaKfYsG4YVxr/5fJasS94W7hm5aRgsKy+KNmGzJkGMli1UH3TvrsRE/jL4Ch9q1N3BmACxdoXvdJl9/Pfqb+eTYeOBetXPJ53JOSw2U+3H7QgURNF/Gdi6j2ZcvhTV5t5dDin4HfyTnUe4dlJPT5GWIn8FX89uq/+</SessionToken>
                <Expiration>2022-09-27T14:21:18Z</Expiration>
            </Credentials>
            <SubjectFromWebIdentityToken>111...134</SubjectFromWebIdentityToken>
        </AssumeRoleWithWebIdentityResult>
        <ResponseMetadata>
            <RequestId>567bbedf-1a08-4be6-bb59-de7a1f51857d</RequestId>
        </ResponseMetadata>
    </AssumeRoleWithWebIdentityResponse>
`

## Policy in AWS (Proxy-Account)

``

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Federated": "accounts.google.com"
                },
                "Action": "sts:AssumeRoleWithWebIdentity",
                "Condition": {
                    "StringEquals": {
                        "accounts.google.com:aud": "111...134",
                        "accounts.google.com:oaud": "ccf-app@ogcs-btqm-osphub.iam.gserviceaccount.com",
                        "accounts.google.com:sub": "111...134"
                    },
                    "Null": {
                        "accounts.google.com:aud": "false",
                        "accounts.google.com:oaud": "false"
                    }
                }
            }
        ]
    }
``

Die Rolle uss folgende Permission(inline policy) haben:

``

    {
        "Version": "2012-10-17",
        "Statement": {
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "*"
        }
    }
``

## Konfiguration der ccf-Rolle in den Zielprojekten

Siehe `cloudformation/ccf-osp.yaml`

## Konfiguration im Code

Im Code musste bei den AWS-Services in der Datei `packages/common/Config.ts`  bei den AWS-Services _Lambda_ herauslöschen. Andernfalls kommt es zu einem Fehler bzgl. Zeitversatz in der Anwendung (siehe https://groups.google.com/g/cloud-carbon-footprint/c/Pac9XQks6W0 )

## Konfiguration im Environment

See https://www.cloudcarbonfootprint.org/docs/configurations-glossary

| Environment-Variable         | Value                                                    | Bemerkung                                                                                                                                                                                                                                       |
|------------------------------|----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|GOOGLE_APPLICATION_CREDENTIALS | .gac                                                     | Datei die, die Google-Credentials enthält                                                                                                                                                                                                       |
|GOOGLE_APPLICATION_CREDENTIALS_CONTENT| <json-service-account-key>...Top-Geheim          | der Inhalt der Datei .gac                                                                                                                                                                                                                       |
| AWS_ACCOUNTS                 | [{"id":"168111911178", "name":"ogcs-osp-ivs-test-9pha"}] | Array der AWS-Projekte die unter das Monitoring fallen.                                                                                                                                                                                         |
| AWS_AUTH_MODE                | GCP                                                      |                                                                                                                                                                                                                                                 |
| AWS_PROXY_ACCOUNT_ID         | 494038884865                                             | Entspricht der ID des Proxy-Accounts im AWS-Projekt *ogcs-ospithub-3wa9*<br/><br/> arn:aws:iam::**494038884865**:role/ccfproxy<br/><br/> see Code `GCPCredentials.ts   `arn:aws:iam::${**this.proxyAccountId**}:role/${this.proxyRoleName}`,    |
| AWS_PROXY_ROLE_NAME          | ccfproxy                                                 | Entspricht der Rolle des Proxy-Accounts im AWS-Projekt *ogcs-ospithub-3wa9*<br/><br/> arn:aws:iam::494038884865:role/**ccfproxy**<br/><br/> see Code `GCPCredentials.ts   `arn:aws:iam::${this.proxyAccountId}:role/${**this.proxyRoleName**}`, |
| AWS_TARGET_ACCOUNT_ROLE_NAME | ccf                                                      | Entspricht der Rolle der AWS-Zielprojekte die AWS_ACCOUNTS-Array aufgeführt sind<br/><br/> see Code `GCPCredentials.ts   `arn:aws:iam::${this.accountId}:role/**${this.targetRoleName}**`,                                                      |
| AWS_USE_BILLING_DATA         | false                                                    | *Higher Accuracy* ist Gegenteil von *Billing Approach*                                                                                                                                                                                          |

