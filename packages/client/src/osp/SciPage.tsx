import React, { ReactElement } from 'react'
import { Grid } from '@material-ui/core'
import SciCalculator from './SciCalculator'

// TODO: Does the page need any Props?
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SciPageProps {}

const SciPage = (_props: SciPageProps): ReactElement<SciPageProps> => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ height: '100%' }}
    >
      <SciCalculator></SciCalculator>
    </Grid>
  )
}

export default SciPage
