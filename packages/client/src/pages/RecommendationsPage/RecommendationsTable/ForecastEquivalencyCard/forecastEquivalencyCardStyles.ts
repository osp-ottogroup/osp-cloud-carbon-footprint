/*
 * © 2021 Thoughtworks, Inc.
 */

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  card: {
    backgroundColor: '#EC6559',
    flex: '1 1 350px',
    maxWidth: 600,
    minHeight: 350,
    border: '5px solid #EC6559',
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    backgroundColor: '#EC6559',
    width: '100%',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    lineHeight: 1,
    color: 'white',
  },
  textContent: {
    fontSize: 36,
    textAlign: 'center',
  },
  contentContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: 'white',
    gap: 30,
    width: '100%',
    minHeight: 350 - 79,
    alignItems: 'center',
  },
  treeSeedlingsIcon: {
    width: 104,
    height: 104,
    color: '#D3C661',
  },
  calendarIcon: {
    width: 90,
    height: 90,
    color: '#DCA479',
    marginBottom: 13,
    marginTop: 3,
  },
  contentItemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 180,
    padding: 10,
  },
}))

export default useStyles
