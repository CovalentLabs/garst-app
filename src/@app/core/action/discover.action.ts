import { Injectable } from '@angular/core'

import { AppStateService, ActionUpdate, EffectUpdate } from '@app/core/app-state'
import { DefaultDiscover, DeviceState } from '@app/core/model'

import * as moment from 'moment'

function reltime(num: number, unit: moment.unitOfTime.DurationConstructor): Date {
  return moment().add(num, unit).toDate()
}

@Injectable()
export class DiscoverActions {
  constructor(private app: AppStateService) {}

  stopDiscover() {
    const update: ActionUpdate = this.app.action("Discovering")

    // Kick off showing the DiscoverBar which will have a spinner
    // as IsDiscovering is likely false
    update("Stopping", {
      Discover: DefaultDiscover,
      Device: {
        // Navigate to discover page
        URL: '/home'
      }
    })
  }

  startDiscover() {
    const update: ActionUpdate = this.app.action("Discovering")

    const state = this.app.getState()

    // Kick off showing the DiscoverBar which will have a spinner
    // as IsDiscovering is likely false
    update("Setting Up", {
      Device: {
        // Navigate to discover page
        URL: '/discovering',
        // Indicate new state
        State: DeviceState.IN_GROUP
      }
    })

    // TODO: Everything here would be triggered by Server communication

    const server_update: EffectUpdate = this.app.effect("Discovering")

    // Start Discover channel
    let pea = {
      Id: 'pea0',
      Availability: [{ Id: 'p0av0', Start: reltime(1, 'hour'), End: reltime(3, 'hours') }],
      Profile: state.Login.Credentials.Profile
    }

    setTimeout(
      () => server_update("Started", {
        Discover: {
          Pea: pea,
          Pod: {
            Id: 'pod0p0',
            Peas: [pea]
          },
          Matches: [],
          InvitationOptions: {
            Friends: []
          },
        }
      }),
      1500
    )
  }

  toggleShowAvailability(show?: boolean) {
    const update: ActionUpdate = this.app.action("Discover Toggle ShowAvailabilityOptions")

    // If no value, then toggle
    if (show == null) {
      show = !this.app.getState().Discover.ShowAvailabilityOptions
    }

    update(show ? "Show" : "Hide", {
      Discover: {
        ShowAvailabilityOptions: show
      }
    })
  }

  // Toggle the options menu for showing friends you may invite.
  toggleShowInvitationOptions(show?: boolean) {
    const update: ActionUpdate = this.app.action("Discover Toggle ShowInvitationOptions")

    // If no value, then toggle
    if (show == null) {
      show = !this.app.getState().Discover.ShowInvitationOptions
    }

    // TODO: Should we populate the InvitationOptions now?

    update(show ? "Show" : "Hide", {
      Discover: {
        ShowInvitationOptions: show
      }
    })
  }
}
