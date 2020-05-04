if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
}
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js')

var firebaseConfig = {
        apiKey: "AIzaSyCrEFL41h1vJMmMIQ73c2YDl_E0DWfQcgM",
        authDomain: "chatapplinkedin.firebaseapp.com",
        databaseURL: "https://chatapplinkedin.firebaseio.com",
        projectId: "chatapplinkedin",
        storageBucket: "chatapplinkedin.appspot.com",
        messagingSenderId: "657515951047",
        appId: "1:657515951047:web:afe434388a5ca8d60e9fe2",
        measurementId: "G-Z5F74FXXLZ"
};

firebase.initializeApp(firebaseConfig);

const messaging =firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload){
	const title='Hello Notification';
	const option={
		body:payload.data.status
	};
	return self.registration.showNotification(title,options);
})
