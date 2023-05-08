// fetch('https://jsonplaceholder.typicode.com/posts')
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(posts) {
//         posts.forEach(function(post) {
//             console.log(post);
//         });
//     })
//     .catch(function(error) {
//         console.error(error);
//     });


fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => console.log(post));
    })
    .catch(error => console.error(error));




function getLastCommitDate(username) {
    const url = `https://api.github.com/users/${username}/events`;
    const token = githubKey;
    const options = {
        headers: {
            'Authorization': `token ${token}`
        }
    };
    return fetch(url, options)
        .then(response => response.json())
        .then(events => {
            const lastPushEvent = events.find(event => event.type === "PushEvent");
            if (lastPushEvent) {
                return lastPushEvent.created_at;
            } else {
                throw new Error("No push events found for this user.");
            }
        })
        .then(dateString => new Date(dateString).toDateString());
}

console.log(getLastCommitDate('Liam0C0NN0R'));


function wait(milliseconds) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(milliseconds);
        }, milliseconds);
    });
}

wait(1000).then(milliseconds => console.log(`You'll see this after ${milliseconds} milliseconds`));
wait(3000).then(milliseconds => console.log(`You'll see this after ${milliseconds} milliseconds`));
