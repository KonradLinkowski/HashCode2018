"use strict"

// file system module
const fs = require('fs');

// in/out file paths
const paths = {
  a: {
    in: 'a_example.in',
    out: 'a.out'
  },
  b: {
    in: 'b_should_be_easy.in',
    out: 'b.out'
  },
  c: {
    in: 'c_no_hurry.in',
    out: 'c.out'
  },
  d: {
    in: 'd_metropolis.in',
    out: 'd.out'
  },
  e: {
    in: 'e_high_bonus.in',
    out: 'e.out'
  }
}

// get dataset from console, default dataset a
let currentPath = process.argv.length > 2 ? paths[process.argv[2]] : paths.a;
let shoudBeSaved = process.argv.length > 3 ? true: false;

class Vehicle {
  // x - row, y - column, time - current time step
  constructor(x, y, time) {
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.time = parseInt(time);
    this.points = 0;
    this.rides = [];
  }
  // dinstance (in steps) between a and b
  stepsTo(a, b) {
    return Math.abs(a - this.x) + Math.abs(b - this.y)
  }
  // go to a and b and set the time
  goto(a, b) {
    this.time += this.stepsTo(a, b);
    this.x = a;
    this.y = b;
  }
  // go to the final coordinates of ride and calculate the time step
  makeRide(ride) {
    // set time to the beginning of this ride 
    this.time += this.stepsTo(ride.a, ride.b);
    //console.log(this.time, ride.ear)
    // check if bonus can be added
    if (this.time < ride.ear) {
      //console.log('bonus', ride.id)
      bonus++;
      this.points += B;
      this.time = ride.ear
    }
    // set time to the end of this ride
    this.time += ride.distance;
    let bonusbgc = false;
    // check if points can be added
    if (this.time <= ride.last) {
      // add points equal distance of this ride
      this.points += ride.distance;
      bonusbgc = true;
    }
    if (!bonusbgc) {
      console.log('no points')
    }
    this.x = ride.x;
    this.y = ride.y;
    this.rides.push(ride.id)
  }
  // calculates best ride for this vehicle
  calc(rides) {
    let best = 0 //rides[0].distance / (rides[0].distance + this.stepsTo(rides[0].a, rides[0].b));
    let index = null;
    for (let i = 0; i < rides.length; i++) {
      // if vehicle can't take a ride skip
      if (this.time + rides[i].distance + this.stepsTo(rides[i].x, rides[i].y) > rides[i].last) {
        continue
      }
      // calculate ride's profitability
      let temp = rides[i].distance / (clamp(rides[i].ear - this.time, 0, 10) + rides[i].distance + this.stepsTo(rides[i].a, rides[i].b));
      //console.log(this, i, temp, best)
      if (temp > best) {
        //console.log('przepis')
        best = temp;
        index = i;
      }
    }
    return index;
  }
  // final output format
  toString() {
    let out = [this.rides.length.toString()];
    for (let i = 0; i < this.rides.length; i++) {
      out.push(this.rides[i].toString())
    }
    return out.join(' ');
  }
}
class Ride {
  // id - number of this ride, a / b - beginning row / column, x / y - final row / column
  // ear - earliest start time, last - latest finish time
  constructor(id, a, b, x, y, ear, last) {
    this.id = parseInt(id);
    this.a = parseInt(a);
    this.b = parseInt(b);
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.ear = parseInt(ear);
    this.last = parseInt(last);
    // length of this ride
    this.distance = Math.abs(this.x - this.a) + Math.abs(this.y - this.b);
  }
}

// read data from file
let data = fs.readFileSync(currentPath.in, 'utf8');

// bonus counter
let bonus = 0;

//split data to rows
data = data.split('\n')
for (let i = 0; i < data.length; i++) {
  // split each row by space
  data[i] = data[i].split(' ')
}

// number of rows of the grid
const R = parseInt(data[0][0])
// number of columns of the grid
const C = parseInt(data[0][1])
// number of vehicles in the fleet
const F = parseInt(data[0][2])
// number of rides
const N = parseInt(data[0][3])
// per-ride bonus for starting the ride on time
const B = parseInt(data[0][4])
// number of steps in the simulation
const T = parseInt(data[0][5])

// load vehicles to an array
let vehicles = [];
for (let i = 0; i < F; i++) {
  vehicles.push(new Vehicle(0, 0, 0))
}

// load rides to an array
let rides = [];
for (let i = 0; i < N; i++) {
  rides.push(new Ride(i, data[i + 1][0], data[i + 1][1], data[i + 1][2], data[i + 1][3], data[i + 1][4], data[i + 1][5]))
}

//console.log(rides)
let tempLength;
// repeat until there are available rides
while(rides.length !== 0) {
  //console.log(rides.length)
  tempLength = rides.length;
  vehicles.forEach(veh => {
    if (rides.length === 0) {
      return;
    }
    // calculate best ride for this vehicle
    let index = veh.calc(rides, veh)
    if (index !== null) {
      veh.makeRide(rides[index]);
      rides.splice(index, 1);
    }
  })
  // if number of rides didn't changed break out of the loop
  if (tempLength == rides.length) {
    break;
  }
}

// prepare output string and calculate points
let points = 0;
let output = '';
vehicles.forEach(veh => {
  points += parseInt(veh.points);
  output += veh.toString() + '\n'
})
// console.log(output)
console.log('points', points)
console.log('bonus bgc', bonus)
if (shoudBeSaved) {
  fs.writeFileSync(currentPath.out, output);
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}