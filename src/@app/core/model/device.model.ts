
export
enum DeviceState {
  IDLING,
  IN_GROUP,
}

export
type Device = {
  // Current Location URL of the App
  URL: string

  State: DeviceState

  // FUTURE: Set up experiments in here as well as device information
  // This would be good for A/B Testing and tracking versions,
  // Reference PlanOut language.
  // Experiments: {
  //  ToggledOn: ExperimentId[]
  //  Items: Experiment
  // }
  // Agent: {
  //  OS: 'ios' | 'wp' | 'android'
  //  Version: string
  // }
}

export
const DefaultDevice: Device = {
  URL: '/',
  State: DeviceState.IDLING,
}

