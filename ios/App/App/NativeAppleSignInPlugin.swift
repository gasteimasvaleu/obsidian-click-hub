import Foundation
import Capacitor
import AuthenticationServices

@objc(NativeAppleSignInPlugin)
public class NativeAppleSignInPlugin: CAPPlugin, CAPBridgedPlugin, ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {

    public let identifier = "NativeAppleSignInPlugin"
    public let jsName = "NativeAppleSignIn"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authorize", returnType: CAPPluginReturnPromise)
    ]

    private var currentCall: CAPPluginCall?

    @objc func authorize(_ call: CAPPluginCall) {
        self.currentCall = call

        let appleIDProvider = ASAuthorizationAppleIDProvider()
        let request = appleIDProvider.createRequest()
        request.requestedScopes = [.fullName, .email]

        let authorizationController = ASAuthorizationController(authorizationRequests: [request])
        authorizationController.delegate = self
        authorizationController.presentationContextProvider = self
        
        DispatchQueue.main.async {
            authorizationController.performRequests()
        }
    }

    public func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return self.bridge?.webView?.window ?? UIWindow()
    }

    public func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential else {
            currentCall?.reject("Invalid credential type")
            currentCall = nil
            return
        }

        guard let identityTokenData = appleIDCredential.identityToken,
              let identityToken = String(data: identityTokenData, encoding: .utf8) else {
            currentCall?.reject("Unable to retrieve identity token")
            currentCall = nil
            return
        }

        let authorizationCode: String
        if let codeData = appleIDCredential.authorizationCode,
           let code = String(data: codeData, encoding: .utf8) {
            authorizationCode = code
        } else {
            authorizationCode = ""
        }

        var result: [String: Any] = [
            "identityToken": identityToken,
            "authorizationCode": authorizationCode
        ]

        if let givenName = appleIDCredential.fullName?.givenName {
            result["givenName"] = givenName
        }
        if let familyName = appleIDCredential.fullName?.familyName {
            result["familyName"] = familyName
        }
        if let email = appleIDCredential.email {
            result["email"] = email
        }

        currentCall?.resolve(result)
        currentCall = nil
    }

    public func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        let authError = error as? ASAuthorizationError
        if authError?.code == .canceled {
            currentCall?.reject("cancelled", "1001")
        } else {
            currentCall?.reject(error.localizedDescription)
        }
        currentCall = nil
    }
}
