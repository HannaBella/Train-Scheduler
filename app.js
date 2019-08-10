var firebaseConfig = {
    apiKey: "AIzaSyCKJ5hzUufnF0COxJdRq0Ai-YQSikANboc",
    authDomain: "test-41bc2.firebaseapp.com",
    databaseURL: "https://test-41bc2.firebaseio.com",
    projectId: "test-41bc2",
    storageBucket: "",
    messagingSenderId: "607141987571",
    appId: "1:607141987571:web:dbfc2d9e352f8f57"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var database = firebase.database();
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainStartTime = $("#start-time-input").val().trim();
    var trainFrequency = $("#train-frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        tDestination: destination,
        startT: trainStartTime,
        tFrequencey: trainFrequency
    };

    // Uploads train data to the database 
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-time-input").val("");
    $("#train-frequency-input").val("");

});
// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().tDestination;
    var trainStartTime = childSnapshot.val().startT;
    var trainFrequency = childSnapshot.val().tFrequencey;


    // First Time (pushed back 1 year to make sure it comes before current time)
    var trainStartPretty = moment(trainStartTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(trainStartPretty), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format('LT');

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrain),
        $("<td>").text(tMinutesTillTrain)

    );

    // Append the new row to the table
    $("#train-schedule-table > tbody").append(newRow);
});