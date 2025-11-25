export function initGoogle(clientId, callback){
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback
    });
  }
  
  export function renderGoogleButton(elId){
    if (!window.google) return;
    window.google.accounts.id.renderButton(
      document.getElementById(elId),
      { theme: "outline", size: "large" }
    );
  }
  