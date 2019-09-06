var firebaseConfig = {
  apiKey: "AIzaSyBDk8RuuXGOvffqn_pw-EmlRVir_VZ7JfI",
  authDomain: "traintime-650a0.firebaseapp.com",
  databaseURL: "https://traintime-650a0.firebaseio.com",
  projectId: "traintime-650a0",
  storageBucket: "traintime-650a0.appspot.com",
  messagingSenderId: "551164400863",
  appId: "1:551164400863:web:9c51f13820cb0100"
};

firebase.initializeApp(firebaseConfig);
console.log(firebase);

var trainData = firebase.database().ref(); //TODO https://firebase.google.com/docs/database/web/lists-of-data#sorting_and_filtering_data

$(document).ready(function(){
  loadTheTable();
  
  
  var trainName;
  var destination;
  var firstTrainTime;
  var frequency;
  var nextArrival = '';
  var minutesAway = '';
  var dateAdded = moment().format("LT");
  var timeRef = firebase.database().ref();
 
  $("#add-btn").on("click", function(e) {
    e.preventDefault();
    var trainName = $("#train-name-input")
      .val()
      .trim();
    var destination = $("#destination-input")
      .val()
      .trim();
    var firstTrainTime = $("#firstTrain-input")
      .val()
      .trim();
    var frequency = $("#frequency-input")
      .val()
      .trim();
  
    trainData.push({
      train_Name: trainName,
      destination: destination,
      first_Train_Time: firstTrainTime,
      frequency: frequency,
      date_Added: dateAdded,
      nextArrival: nextArrival,
      minutesAway: minutesAway
    });
    clearForm();
    loadTheTable();
  });
});


function clearForm(){
  $("#train-name-input").val('');//TODO
}

function loadTheTable(){
  $('.table tbody').html('');
  console.log(trainData);
  trainData.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        console.log(childData);
        var nextArrival = '';
        var minutesAway = '';
        // time object start
        // Start: 12:00
        // Freq: 15
        // Right now: 18:05
        // Next arr: 18:15
        // Min rem: 10mins
        /*
          18:05 - 12:00 = 6:05 (convert to mins) = 365mins
          365 / 15 = 24 (IGNORE THIS )
          365 % 15 = 5mins
          freq - 5mins = 
          15 - 5 = 10mins 
          next-arrival = time-rem + now

          1.Get current time from JS 
          2. convert current time to minutes
        */
       var now = moment();
       var firstMove = moment(childData.first_Train_Time, "HH:mm");
       console.log(now);
       console.log(firstMove);
       var duration = moment.duration(now.diff(firstMove));
       var minutesDuration = parseInt(duration.asMinutes());
       var temp = minutesDuration % parseInt(childData.frequency);
       var minutesAway = parseInt(childData.frequency) - temp;
       var nextArrival = moment().add(minutesAway, 'minutes').format('LT');
        $('.table tbody').append('<tr><td>'+childData.train_Name+'</td><td>'+childData.destination+'</td><td>'+childData.frequency+'</td><td>'+nextArrival+'</td><td>'+minutesAway+'</td></tr>')
    });
  });
}

// trainData.forEach(tuple);
// let row = $("<tr/>");
// row.append($(`<td>${tuple.trainName}</td>`));
// row.append($(`<td>${tuple.destination}</td>`));
// // row.append($(`<td>${tuple.firstTrainTime}</td>`));
// row.append($(`<td>${tuple.frequency}</td>`));
// var nextArrivalTime = moment(tuple.firstTrainTime)
//   .add(tuple.frequencyTime, "minute")
//   .format("m mm");

// function insertData() {
//   let row = $("<tr/>");
//   row.append($(`<td>${trainName}</td>`));
//   row.append($(`<td>${destination}</td>`));
//   // row.append($(`<td>${tuple.firstTrainTime}</td>`));
//   row.append($(`<td>${frequency}</td>`));
//   var nextArrivalTime = moment(firstTrainTime)
//     .add(frequencyTime, "minute")
//     .format("m mm");
// }

// });
// trainData
//   .orderByChild("dateAdded")
//   .limiToLast(1)
//   .on("child_added", function(snapshot) {
//     let row = $("<tr/>");
//     row.append($(`<td>${trainName}</td>`));
//     row.append($(`<td>${destination}</td>`));
//     // row.append($(`<td>${tuple.firstTrainTime}</td>`));
//     row.append($(`<td>${frequency}</td>`));
//     nextArrival = firstTrainTime + frequency;
//     row.append($(`<td>${nextArrival}</td>`));
//     minutesAway = nextArrival - now;
//     row.append($(`<td>${minutesAway}</td>`));
//   });

