import UIKit
import Capacitor

class MyViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(NativeAppleSignInPlugin())
        print("✅ NativeAppleSignInPlugin registered explicitly via MyViewController")
    }
}
