import PurePhoneAdapter from "Backend/adapters/pure-phone/pure-phone-adapter.class"
import DeviceResponse, {
  DeviceResponseStatus,
} from "Backend/adapters/device-response.interface"

class PurePhoneFakeAdapter extends PurePhoneAdapter {
  public getModelName(): string {
    return "Ziemniaczek Puree"
  }

  public getModelNumber(): string {
    return "Y0105W4GG1N5"
  }

  public getName(): string {
    return "Mudita Pure"
  }

  public getOsUpdateDate(): string {
    return "2020-01-14T11:31:08.244Z"
  }

  public getOsVersion(): string {
    return "3.1.0"
  }

  public getSerialNumber(): string {
    return "1UB13213MN14K1"
  }

  public disconnectDevice(): DeviceResponse {
    return {
      status: DeviceResponseStatus.Ok,
    }
  }

  public connectDevice(): Promise<DeviceResponse> {


  }

  public updateOs(): any {
    return "lala"
  }
}

const createFakePurePhoneAdapter = (): PurePhoneAdapter =>
  new PurePhoneFakeAdapter()

export default createFakePurePhoneAdapter
