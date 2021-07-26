/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

export interface OnboardingWelcomeProps {
  onCancel?: () => void
  onTroubleshooting?: () => void
}

export interface OnboardingConnectingProps {
  onCancel?: () => void
}

export interface OnboardingTroubleshootingProps {
  onRetry?: () => void
  onContact?: () => void
}
