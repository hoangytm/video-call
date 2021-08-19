const socket = io()
const videoGrid = document.getElementById('video-grid')
const peers = {}
const myPeer = new Peer(null, {
    debug: 2
});

var roomId = document.getElementById('mydiv').dataset.test
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    addVideoStream(myVideo, stream)
    myPeer.on('call', call => {
        call.answer(stream)
        call.on('stream', userVideoStream => {
            const video = document.createElement('video')
            console.log('add video when call at browser')
            addVideoStream(video, userVideoStream)
        })
    })
    myVideoStream = stream;

    // socket
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
    socket.on('user-disconnected', userId => {
        console.log('disconnect')

        var element = document.getElementById(userId);
        element.parentNode.removeChild(element);

        if (peers[userId]){
            peers[userId].close()
            delete peerConnections[id];
        } 
    })
    

})
myPeer.on('open', (id) => {
    console.log('peer open')
    socket.emit('join-room', roomId, id)
});
function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    call.on('stream', userVideoStream => {
        const video = document.createElement('video')
        video.id =userId
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
        console.log('close')
    })

}
function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}
