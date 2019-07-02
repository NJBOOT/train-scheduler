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

        if (name != "" && dest != "" && time != "" && freq != "") {
            database.ref().push({
                name: name,
                destination: dest,
                time: time,
                frequency: freq
            });
        } else {
            alert("Enter Valid Train Data");
            $("#train-name").val("");
            $("#train-destination").val("");
            $("#train-time").val("");
            $("#frequency").val("");
            return false;
        }
    })

    database.ref().on("child_added", function (snapshot) {

        var sv = snapshot.val();

        // Console logging the last user's data
        console.log(sv.name);
        console.log(sv.destination);
        console.log(sv.time);
        console.log(sv.frequency);

        // calculate moment values before appending to tbody

        // format current time in military
        currentTime = moment().format("HH:mm");
        console.log("Current Time: " + currentTime)

        // The calculation part took a lot of googling. Credit to previous train sched. githubs in particular "https://github.com/ThompsonJonM/train-scheduler/blob/master/assets/javascript/logic.js"

        // Subtract a year from current moment to future proof app calculations (make sure it comes before current time). 
        var firstArrivalConverted = moment(sv.time, "HH:mm").subtract(1, "years");
        console.log("First Arrival: " + firstArrivalConverted)

        //Calculate the difference between now and first train time
        var diff = moment().diff(moment(firstArrivalConverted), "minutes");

        //Divide the train time difference (now vs first arrival) by the frequency it runs using the modulus operator to retreive leftover time. 
        var leftover = diff % sv.frequency;

        //Subtract the leftover mod. value from the frequency to obtain the "timeLeft" value. 
        var timeLeft = sv.frequency - leftover;
        console.log("Time Left until Train: " + timeLeft)

        // Add minutes left until first arrival to current time to calculate next train arrival. 
        var trainArrival = moment().add(timeLeft, "m").format("HH:mm");
        console.log("Next Train Arrival: " + trainArrival);

        // make a table row saved to var
        var newRow = $("<tr>")

        // make each td and append to row
        var trainName = $("<td>").text(sv.name);
        var trainDest = $("<td>").text(sv.destination);
        var trainFreq = $("<td>").text(sv.frequency);
        var trainArr = $("<td>").text(trainArrival);
        var minAway = $("<td>").text(timeLeft);

        newRow.append(trainName);
        newRow.append(trainDest);
        newRow.append(trainFreq);
        newRow.append(trainArr);
        newRow.append(minAway);

        // append to tbody
        $("#tableContent").append(newRow)

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});

