

export class Rectangle {
    constructor(str) {
      this.height = 0;
      this.width = 0;
      if(str && str.indexOf(',') > 0){
          var arr = str.split(',');
          if(typeof arr[0] != 'undefined')this.width = parseFloat(arr[0]);
          if(typeof arr[1] != 'undefined')this.height = parseFloat(arr[1]);        
      }
    }
  }
  
  export class Vector2 {
      constructor(str) {
          this.x = 0;
          this.y = 0;
          if(str && str.indexOf(',') > 0){
              var arr = str.split(',');
              if(typeof arr[0] != 'undefined')this.x = parseFloat(arr[0]);
              if(typeof arr[1] != 'undefined')this.y = parseFloat(arr[1]);
          }
      }
  }
  
  export class Vector3 {
    constructor(str) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      if(str && str.indexOf(',') > 0){
          var arr = str.split(',');
          if(typeof arr[0] != 'undefined')this.x = parseFloat(arr[0]);
          if(typeof arr[1] != 'undefined')this.y = parseFloat(arr[1]);
          if(typeof arr[2] != 'undefined')this.z = parseFloat(arr[2]);                
      }
    }
  }
  
  export function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
 
 export function radiansToDegrees(radians)
 {
     var pi = Math.PI;
     return radians * (180/pi);
 }   

 export function exponentialEasing (x, a){

  var epsilon = 0.00001;
  var min_param_a = epsilon;
  var max_param_a = 1.0 - epsilon;
  a = Math.max(min_param_a, Math.min(max_param_a, a));

  if (a < 0.5){
      // emphasis
      a = 2.0*(a);
      var y = Math.pow(x, a);
      return y;
  } else {
      // de-emphasis
      a = 2.0*(a-0.5);
      var y = Math.pow(x, 1.0/(1-a));
      return y;
  }
}