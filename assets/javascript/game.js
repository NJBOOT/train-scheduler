$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyBE4rIfU_He-8pm0yhw6W8ux1lKpQt19h8",
        authDomain: "helloworld-bcc36.firebaseapp.com",
        databaseURL: "https://helloworld-bcc36.firebaseio.com",
        storageBucket: "helloworld-bcc36.appspot.com",
        messagingSenderId: "1029172247104"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    $("#submit-btn").on("click", function () {
        var name = $("#train-name").val().trim()
        var dest = $("#train-destination").val().trim()
        var time = $("#train-time").val().trim()
        var freq = $("#frequency").val().trim()

        database.ref().push({
            name: name,
            destination: dest,
            time: time,
            frequency: freq
        });
    })

    database.ref().on("child_added", function (snapshot) {

        var sv = snapshot.val();

        // Console logging the last user's data
        console.log(sv);
        console.log(sv.name);
        console.log(sv.destination);
        console.log(sv.time);
        console.log(sv.frequency);

        currentTime = moment();
        console.log(currentTime)

        var firstArrivalConverted = moment(sv.time , "HH:mm A").subtract(1, "years");
        console.log(firstArrivalConverted)

        var diff = moment().diff(moment(firstArrivalConverted) , "minutes");
        var leftover = diff % sv.frequency;
        
        var timeLeft = sv.frequency - leftover;
        console.log("Time Left until Train: "+timeLeft)

        var trainArrival = moment().add(timeLeft , "m").format("HH:mm: A");
        console.log("Next Train Arrival: "+trainArrival)

        // make a table row saved to var
        var newRow = $("<tr>")

        var trainName = $("<td>").text(sv.name)
        var trainDest = $("<td>").text(sv.destination)
        var trainFreq = $("<td>").text(sv.frequency)
 


        newRow.append(trainName)
        newRow.append(trainDest)
        newRow.append(trainFreq)
 

        $("#tableContent").append(newRow)

        // make each td and append to row
        // calculate moment values before appending to tbody


        // // Change the HTML to reflect
        // $("#name-display").text(sv.name);
        // $("#email-display").text(sv.email);
        // $("#age-display").text(sv.age);
        // $("#comment-display").html(<tr>);

        // append to tbody


    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});

