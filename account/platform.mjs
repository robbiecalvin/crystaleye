/** The same account supports the website and packaged native WebViews. */
export const nativeAuthRedirect='crystaleye://auth/callback';
export function isNative(){return Boolean(globalThis.Capacitor?.isNativePlatform?.());}
export function authRedirect(webURL){return isNative()?nativeAuthRedirect:webURL;}
export function authCodeFromURL(input){
 try{const url=new URL(input);if(url.protocol!=='crystaleye:'||url.hostname!=='auth'||url.pathname!=='/callback'||url.username||url.password||url.port)return null;const code=url.searchParams.get('code');return code&&code.length<=2048?code:null;}catch{return null;}
}
