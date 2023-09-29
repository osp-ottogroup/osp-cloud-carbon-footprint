import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  TextField,
  Typography,
} from '@material-ui/core'
import React, { ReactElement } from 'react'

// TODO: Does the SciCalculator need any Props?
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SciCalculatorProps {}

const SciCalculator = (
  _props: SciCalculatorProps,
): ReactElement<SciCalculatorProps> => {
  return (
    <Card variant="elevation" color="primary">
      <CardContent>
        <Typography variant="h6">SCI Score berechnen</Typography>
        <Divider style={{ margin: 12 }} />
      </CardContent>
      <CardContent
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
          gap: 12,
        }}
      >
        <TextField variant="outlined" label="Functional Unit" />
        <TextField variant="outlined" label="Menge" />
        <CardActions style={{ gridColumn: '1/-1' }}>
          <Button variant="contained" color="primary" fullWidth>
            Berechnen
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  )
}

export default SciCalculator
