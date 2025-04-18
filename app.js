//load main menu
$( document ).ready(function() {
   $.get("html/main_menu.html", function(content){
      document.querySelector('.content').innerHTML = content;
      mainMenu();
   }, 'html')

   //load runways
   $.get("assets/runways_new.json", function(data){
      document.runways = JSON.parse(data)
      console.log(document.runways)
   }, 'html')
});

document.fp = false

//script main_menu
function mainMenu(){


   //load weight and balance page
   $("#wnb").click(function(){
      $.get("html/wnb.html", function(content){
         document.querySelector('.content').innerHTML = content;
         WeightAndBalance();
      }, 'html')
   });

   //load fp page
   $("#fp").click(function(){
      $.get("html/flight_plan.html", function(content){
         document.querySelector('.content').innerHTML = content;
         FlightPlan();
      }, 'html')
   });
   //load totals page
   $("#totals").click(function(){
      $.get("html/totals.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Totals();
      }, 'html')
   });

   //load take-off page
   $("#take-off").click(function(){
      $.get("html/take_off.html", function(content){
         document.querySelector('.content').innerHTML = content;
         TakeOff();
      }, 'html')
   });

   //load climb page
   $("#climb").click(function(){
      $.get("html/climb.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Climb();
      }, 'html')
   });

   //load cruise page
   $("#cruise").click(function(){
      $.get("html/cruise.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Cruise();
      }, 'html')
   });

   //load descent page
   $("#descent").click(function(){
      $.get("html/descent.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Descent();
      }, 'html')
   });

   //load landing page
   $("#landing").click(function(){
      $.get("html/landing.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Landing();
      }, 'html')
   });

   $.ajax({
      type: 'GET',
      url: 'https://api.checkwx.com/metar/EBBR',
      headers: { 'X-API-Key': 'API KEY HERE' },
      dataType: 'json',
      success: function (result) {
        console.log(result.data[0])
      }
    });


   if (document.fp == true){
      document.getElementById( 'warning' ).style.display = 'none'
   }
};

//WNB constansts
const arm = {
   BEW: 83.2,
   p1: 85.5,
   p2: 85.5,
   p3: 119.1,
   p4: 119.1,
   p5: 157.6,
   p6: 157.6,
   front: 42.0,
   aft: 178.7,
   fuel: 94
}

//init all data
//w&b
document.WNB_data = {BEW: 2390, taxi_fuel: 15}

//FP
document.FP_DATA = {}
document.FP_DATA.dep = {icao:'', rwytrack: 0, elevation: 0, qnh: 1013, temp: 15, winddir: 0, windspeed: 0}
document.FP_DATA.arr = {icao:'', rwytrack: 0, elevation: 0, qnh: 1013, temp: 15, winddir: 0, windspeed: 0}
document.FP_DATA.cruise = {altitude: 0, oat: 15, winddir: 0, windspeed: 0, rpm: 2700, tripdistance: 0}
document.FP_DATA.config = {cont_fuel: 0, alt_fuel: 0, hold_fuel: 0, app_time: 0, block_fuel: 0}


//Perf Data
document.PERF_DATA = {}
document.performance = false
//Fuel
document.PERF_DATA.fuel = {taxi_fuel: 2}

//scrip WNB page
function WeightAndBalance(){
   //set fields if already defined
   if (document.WNB_data.p1 !== undefined){
      document.getElementById('p1').value = document.WNB_data.p1
      document.getElementById('p2').value = document.WNB_data.p2
      document.getElementById('p3').value = document.WNB_data.p3
      document.getElementById('p4').value = document.WNB_data.p4
      document.getElementById('p5').value = document.WNB_data.p5
      document.getElementById('p6').value = document.WNB_data.p6
      document.getElementById('front-storage').value = document.WNB_data.front
      document.getElementById('rear-storage').value = document.WNB_data.aft
      document.getElementById('fuelLeft').value= document.WNB_data.fuelLeft
      document.getElementById('fuelRight').value = document.WNB_data.fuelRight
      
   }else{
      document.WNB_data.p1 = parseInt($("#p1").val())
      document.WNB_data.p2 = parseInt($("#p2").val())
      document.WNB_data.p3 = parseInt($("#p3").val())
      document.WNB_data.p4 = parseInt($("#p4").val())
      document.WNB_data.p5 = parseInt($("#p5").val())
      document.WNB_data.p6 = parseInt($("#p6").val())
      document.WNB_data.front = parseInt($("#front-storage").val())
      document.WNB_data.aft = parseInt($("#rear-storage").val())
      document.WNB_data.fuelLeft = parseInt($("#fuelLeft").val())
      document.WNB_data.fuelRight = parseInt($("#fuelRight").val())
   }

   //calulate table values
   calcWNB()
   
   //back button
   $("#back").click(function(){
      $.get("html/main_menu.html", function(content){
         document.querySelector('.content').innerHTML = content;
         mainMenu();
      }, 'html')
   })
   //check limits
   $(".check-limits").click(function(){
      calcWNB()
      checkLimits()
   })
   //cg graph button
   $(".CG").click(function(){
      $.get("html/cg_graph.html", function(content){
         document.querySelector('.content').innerHTML = content;
         cg_graph();
      }, 'html')
   })
    
   $('.kgs').change(function(){
      updateWNB()
   })

   $('.fUnit').change(function(){
      updateWNB()
   })

   $('.inputval').change(function(){
      var a = 1
      if (!($('.kgs').is(":checked"))){
         a = 2.205
      }else if($('.kgs').is(":checked")){
         a = 1
      }

      document.WNB_data.p1 = parseInt($("#p1").val()) * a
      document.WNB_data.p2 = parseInt($("#p2").val()) * a
      document.WNB_data.p3 = parseInt($("#p3").val()) * a
      document.WNB_data.p4 = parseInt($("#p4").val()) * a
      document.WNB_data.p5 = parseInt($("#p5").val()) * a
      document.WNB_data.p6 = parseInt($("#p6").val()) * a
      document.WNB_data.front = parseInt($("#front-storage").val()) * a
      document.WNB_data.aft = parseInt($("#rear-storage").val()) * a

      var b = 1
      if ($('input[name="fuel"]:checked').val() == 'L'){
         b = 1.64
      }else if($('input[name="fuel"]:checked').val() == 'Gal'){
         b = 6.2
      }else if($('input[name="fuel"]:checked').val() == 'Lbs'){
         b = 1
      }else if($('input[name="fuel"]:checked').val() == 'KG'){
         b = 0.454
      }
      document.WNB_data.fuelLeft = parseInt($("#fuelLeft").val()) * b
      document.WNB_data.fuelRight = parseInt($("#fuelRight").val()) * b

      calcWNB()

      document.performance = false
   })
}

function checkLimits(){
   
   function f(x){
      return (49200-800*x)/(-5.5)
   }
   function g(x){
      return 50*x-975
   }
   var a = 1
   if (document.WNB_data.kgs == true){ a = 2.205}
   if((document.WNB_data.to_arm >= 78) && (document.WNB_data.to_arm < 83.5) && ((document.WNB_data.to_weight * a) < f(document.WNB_data.to_arm))){
      document.getElementById("limits").innerHTML = 'OK'
   }else if((document.WNB_data.to_arm >= 83.5) && (document.WNB_data.to_arm < 91.5) && ((document.WNB_data.to_weight * a) < g(document.WNB_data.to_arm))){
      document.getElementById("limits").innerHTML = 'OK'
   }else if((document.WNB_data.to_arm >= 91.5) && (document.WNB_data.to_arm < 95) && ((document.WNB_data.to_weight * a) < 3600)){
      document.getElementById("limits").innerHTML = 'OK'
   }else{
      document.getElementById("limits").innerHTML = 'Not OK'
   }
}

function updateWNB(){
   var a = 1
   var b = 1
   //if in kgs
   if (!($('.kgs').is(":checked"))){
      a = 1 / 2.205
   }else if($('.kgs').is(":checked")){
      a = 1
   }
   if ($('input[name="fuel"]:checked').val() == 'L'){
      b = 0.61
   }else if($('input[name="fuel"]:checked').val() == 'Gal'){
      b = 0.16
   }else if($('input[name="fuel"]:checked').val() == 'Lbs'){
      b = 1
   }else if($('input[name="fuel"]:checked').val() == 'KG'){
      b = 0.454
   }

   document.getElementById("p1").value = Math.round(document.WNB_data.p1 * a)
   document.getElementById("p2").value = Math.round(document.WNB_data.p2 * a)
   document.getElementById("p3").value = Math.round(document.WNB_data.p3 * a)
   document.getElementById("p4").value = Math.round(document.WNB_data.p4 * a)
   document.getElementById("p5").value = Math.round(document.WNB_data.p5 * a)
   document.getElementById("p6").value = Math.round(document.WNB_data.p6 * a)
   document.getElementById("front-storage").value = Math.round(document.WNB_data.front * a)
   document.getElementById("rear-storage").value = Math.round(document.WNB_data.aft * a)

   document.getElementById("fuelLeft").value = Math.round(document.WNB_data.fuelLeft * b)
   document.getElementById("fuelRight").value = Math.round(document.WNB_data.fuelRight * b)
   
   document.getElementById("BEW").innerHTML = Math.round(document.WNB_data.BEW * a)
   document.getElementById("ZFW").innerHTML = Math.round(document.WNB_data.ZFW * a)
   document.getElementById("taxi-fuel").innerHTML = Math.round(document.WNB_data.taxi_fuel * b)
   document.getElementById("loaded-fuel").innerHTML = Math.round(document.WNB_data.loaded_fuel * b)
   if (document.WNB_data.to_weight === 'Error'){
      document.getElementById("to-weight").innerHTML = 'Error'
   }else{
      document.getElementById("to-weight").innerHTML = Math.round(document.WNB_data.to_weight * a)   
   }
   if (document.performance == true){
      document.getElementById("fuel-bo").innerHTML = Math.round(document.PERF_DATA.totals.burnoff * 6.2 * a)
      document.getElementById("landing-weight").innerHTML = Math.round((document.WNB_data.to_weight - document.PERF_DATA.totals.burnoff * 6.2) * a)
   }
}

function calcWNB(){
   //all calculations in lbs
   var a = 1
   if ($('input[name="fuel"]:checked').val() == 'L'){
      a = 0.61
   }else if($('input[name="fuel"]:checked').val() == 'Gal'){
      a = 0.16
   }else if($('input[name="fuel"]:checked').val() == 'Lbs'){
      a = 1
   }else if($('input[name="fuel"]:checked').val() == 'KG'){
      a = 0.454
   }
   document.WNB_data.to_weight = 0
   document.WNB_data.ZFW = document.WNB_data.BEW + document.WNB_data.p1 + document.WNB_data.p2 + document.WNB_data.p3 + document.WNB_data.p4 + document.WNB_data.p5 + document.WNB_data.p6 + document.WNB_data.front + document.WNB_data.aft
   document.WNB_data.loaded_fuel = document.WNB_data.fuelLeft + document.WNB_data.fuelRight
   document.WNB_data.to_weight = document.WNB_data.ZFW + a * document.WNB_data.loaded_fuel - a * document.WNB_data.taxi_fuel
   
   if (document.WNB_data.to_weight <= document.WNB_data.BEW){
      document.WNB_data.to_weight = 'Error'
   }

   updateWNB()

   //calculate cg data
   var _BEW, _p1, _p2, _p3, _p4, _p5, _p6, _aft, _front, _loaded_fuel, _taxi_fuel, _burn_off, burnoff_moment

   //take-off cg
   _BEW = document.WNB_data.BEW * arm.BEW
   _p1 = document.WNB_data.p1 * arm.p1
   _p2 = document.WNB_data.p2 * arm.p2
   _p3 = document.WNB_data.p3 * arm.p3
   _p4 = document.WNB_data.p4 * arm.p4
   _p5 = document.WNB_data.p5 * arm.p5
   _p6 = document.WNB_data.p6 * arm.p6
   _aft = document.WNB_data.aft * arm.aft
   _front = document.WNB_data.front * arm.front
   _loaded_fuel = document.WNB_data.loaded_fuel * arm.fuel
   _taxi_fuel = document.WNB_data.taxi_fuel * arm.fuel
   document.WNB_data.to_moment = _BEW + _p1 + _p2 + _p3 + _p4 + _p5 + _p6 + _front + _aft + _loaded_fuel - _taxi_fuel
   document.WNB_data.to_arm = document.WNB_data.to_moment / document.WNB_data.to_weight

   //calculate landing cg
   if (document.performance == true){
      _burn_off = document.PERF_DATA.totals.burnoff * 6
      burnoff_moment = _burn_off * arm.fuel
      document.WNB_data.landing_moment = document.WNB_data.to_moment - burnoff_moment
      document.WNB_data.landing_arm = document.WNB_data.landing_moment / document.WNB_data.landing_weight
   }
}

function cg_graph(){
   $("#back").click(function(){
      $.get("html/wnb.html", function(content){
         document.querySelector('.content').innerHTML = content;
         WeightAndBalance();
      }, 'html')
   })

   const limits = [{x:78, y:1800}, {x:78, y:2400}, {x:83.5, y:3200}, 
      {x:91.5, y:3600}, {x:95, y:3600}, {x:95, y:1800}]

   var TOW = [{x: document.WNB_data.to_arm, y:document.WNB_data.to_weight}]

   var LW = [{x:document.WNB_data.to_arm, y:document.WNB_data.landing_weight}]

   const config = {
      type: 'scatter',
      data: {
         datasets: [{
            label: "Limits",
            data: limits,
            pointBackgroundColor: 'rgb(33, 168, 209)',
            borderColor: 'rgb(33, 168, 209)'
         },
         {
            label: "TOW",
            data: TOW,
            pointBackgroundColor: 'rgb(136, 204, 126)',
            borderColor: 'rgb(136, 204, 126)'
         },
         {
            label: "LW",
            data: LW,
            pointBackgroundColor: 'rgb(207, 33, 33)',
            borderColor: 'rgb(207, 33, 33)'
         }]
      },
      options: {
         responsive: true,
         showLine: true,
         ticks: {
            color: 'rgb(255, 255, 255)'
         },
         color: 'rgb(255, 255, 255)',
         scales: {
            x: {
               grid: {color: 'rgb(50, 50, 50)'}
            },
            y: {
               grid: {color: 'rgb(50, 50, 50)'}
            }
         }
      }
   };
    
   var cg_graph = new Chart(
      document.getElementById('cg-graph'),
      config
    );
}

//script FP_1 page
function FlightPlan(){
   //back button
   $("#back").click(function(){
      $.get("html/main_menu.html", function(content){
         document.querySelector('.content').innerHTML = content;
         mainMenu();
      }, 'html')
   });

   $("#next-page").click(function(){
      $.get("html/fp2.html", function(content){
         document.querySelector('.content').innerHTML = content;
         FlightPlan2();
      }, 'html')
   })

   //set fields
   document.getElementById('dep-airfield').value =    document.FP_DATA.dep.icao 
   document.getElementById('dep-rwytrack').value =    document.FP_DATA.dep.rwytrack 
   document.getElementById('dep-elevation').value =   document.FP_DATA.dep.elevation
   document.getElementById('dep-qnh').value =         document.FP_DATA.dep.qnh   
   document.getElementById('dep-temp').value =        document.FP_DATA.dep.temp   
   document.getElementById('dep-winddir').value =     document.FP_DATA.dep.winddir 
   document.getElementById('dep-windspeed').value =   document.FP_DATA.dep.windspeed

   document.getElementById('arr-airfield').value =    document.FP_DATA.arr.icao 
   document.getElementById('arr-rwytrack').value =    document.FP_DATA.arr.rwytrack 
   document.getElementById('arr-elevation').value =   document.FP_DATA.arr.elevation
   document.getElementById('arr-qnh').value =         document.FP_DATA.arr.qnh   
   document.getElementById('arr-temp').value =        document.FP_DATA.arr.temp   
   document.getElementById('arr-winddir').value =     document.FP_DATA.arr.winddir 
   document.getElementById('arr-windspeed').value =   document.FP_DATA.arr.windspeed

   document.getElementById('cruise-alt').value =         document.FP_DATA.cruise.altitude 
   document.getElementById('cruise-oat').value =         document.FP_DATA.cruise.oat 
   document.getElementById('cruise-winddir').value =     document.FP_DATA.cruise.winddir
   document.getElementById('cruise-windspeed').value =   document.FP_DATA.cruise.windspeed   
   document.getElementById('cruise-rpm').value =         document.FP_DATA.cruise.rpm   
   document.getElementById('cruise-tripdist').value =    document.FP_DATA.cruise.tripdistance

   $('.inputval').change(function(){
   
      document.FP_DATA.dep.icao =         $("#dep-airfield").val().toUpperCase()
      document.FP_DATA.dep.rwytrack =     parseInt($("#dep-rwytrack").val()) % 360
      document.FP_DATA.dep.elevation =    parseInt($("#dep-elevation").val())
      document.FP_DATA.dep.qnh =          parseInt($("#dep-qnh").val())
      document.FP_DATA.dep.temp =         parseInt($("#dep-temp").val())
      document.FP_DATA.dep.winddir =      parseInt($("#dep-winddir").val()) % 360
      document.FP_DATA.dep.windspeed =    parseInt($("#dep-windspeed").val())

      document.FP_DATA.arr.icao =         $("#arr-airfield").val().toUpperCase()
      document.FP_DATA.arr.rwytrack =     parseInt($("#arr-rwytrack").val()) % 360
      document.FP_DATA.arr.elevation =    parseInt($("#arr-elevation").val())
      document.FP_DATA.arr.qnh =          parseInt($("#arr-qnh").val())
      document.FP_DATA.arr.temp =         parseInt($("#arr-temp").val())
      document.FP_DATA.arr.winddir =      parseInt($("#arr-winddir").val()) % 360
      document.FP_DATA.arr.windspeed =    parseInt($("#arr-windspeed").val())

      document.FP_DATA.cruise.altitude =     parseInt($("#cruise-alt").val())
      document.FP_DATA.cruise.oat =          parseInt($("#cruise-oat").val())
      document.FP_DATA.cruise.winddir =      parseInt($("#cruise-winddir").val()) % 360
      document.FP_DATA.cruise.windspeed =    parseInt($("#cruise-windspeed").val())
      document.FP_DATA.cruise.rpm =          parseInt($("#cruise-rpm").val())
      document.FP_DATA.cruise.tripdistance = parseInt($("#cruise-tripdist").val())
      
   

      document.performance, document.fp, document.fp1 = false
   })

   if ((document.FP_DATA.cruise.altitude != 0) && (document.FP_DATA.cruise.tripdistance != 0)){
      document.fp1 = true
   }
   if ((document.fp1 == true) && (document.fp2 == true)){
      document.fp = true
   }

   
   
}

//script FP_2 page
function FlightPlan2(){
   $("#back").click(function(){
      $.get("html/flight_plan.html", function(content){
         document.querySelector('.content').innerHTML = content;
         FlightPlan();
      }, 'html')
   });
   //calculate performance on confirmation
   $("#confirm-fp").click(function(){
      $.get("html/main_menu.html", function(content){
         document.querySelector('.content').innerHTML = content;
         CalculatePerformance();
         mainMenu()
      }, 'html')
   });

   //set fields
   document.getElementById('cont-fuel').value =   document.FP_DATA.config.cont_fuel 
   document.getElementById('alt-fuel').value =    document.FP_DATA.config.alt_fuel
   document.getElementById('hold-fuel-h').value =   Math.floor(document.FP_DATA.config.hold_fuel / 60)
   document.getElementById('hold-fuel-m').value =   document.FP_DATA.config.hold_fuel % 60
   document.getElementById('app-time-h').value =   Math.floor(document.FP_DATA.config.app_time / 60)
   document.getElementById('app-time-m').value =   document.FP_DATA.config.app_time % 60
   document.getElementById('block-fuel').value =  document.FP_DATA.config.block_fuel

   if(document.WNB_data.ZFW !== undefined){
      document.getElementById('ZFW').innerHTML =     document.WNB_data.ZFW
      document.getElementById('to-weight').innerHTML =     document.WNB_data.to_weight
      document.getElementById('land-weight').innerHTML =     document.WNB_data.landing_weight  
      if (document.WNB_data.landing_weight == undefined){
         document.getElementById('land-weight').innerHTML =     'setup W&B'
      } 
   }

   $('.inputval').change(function(){
   
      document.FP_DATA.config.cont_fuel = parseInt($("#cont-fuel").val())
      document.FP_DATA.config.alt_fuel = parseInt($("#alt-fuel").val())
      document.FP_DATA.config.hold_fuel = parseInt($("#hold-fuel-h").val()) * 60 + parseInt($("#hold-fuel-m").val())
      document.FP_DATA.config.app_time = parseInt($("#app-time-h").val()) * 60 + parseInt($("#app-time-m").val())
      document.FP_DATA.config.block_fuel = parseInt($("#block-fuel").val())
   

      document.performance, document.fp, document.fp2 = false
   })

   if ((document.FP_DATA.config.cont_fuel != 0) && (document.FP_DATA.config.alt_fuel != 0) && (document.FP_DATA.config.hold_fuel != 0) && (document.FP_DATA.config.app_time != 0) && (document.FP_DATA.config.block_fuel != 0 )){
      document.fp2 = true
   }

   if ((document.fp1 == true) && (document.fp2 == true)){
      document.fp = true
   }
}


//==========================================================================
//all performace calculations here:
//==========================================================================

function CalculatePerformance(){

   //degrees to radian
   function degree_to_radian(value){
      var pi = Math.PI
      return value / 180 * pi
   }

   function round(number, i){
      return Math.round(number * 10**i) / 10**i
   }

   function rounddown(number, i){
      return Math.floor(number * 10**i) / 10**i
   }

   function roundup(number, i){
      return Math.ceil(number * 10**i) / 10**i
   }

   //departure
   document.PERF_DATA.departure = {press_alt: 0, headwind: 0, tailwind: 0, isa_temp_diff: 0}
   document.PERF_DATA.departure.press_alt       = document.FP_DATA.dep.elevation + 30 * (1013 - document.FP_DATA.dep.qnh)
   document.PERF_DATA.departure.headwind        = Math.cos(degree_to_radian(document.FP_DATA.dep.winddir - document.FP_DATA.dep.rwytrack)) * document.FP_DATA.dep.windspeed
   document.PERF_DATA.departure.tailwind        = -1 * Math.cos(degree_to_radian(document.FP_DATA.dep.winddir - document.FP_DATA.dep.rwytrack)) * document.FP_DATA.dep.windspeed
   document.PERF_DATA.departure.isa_temp_diff   = document.FP_DATA.dep.temp - 15 + 2 * document.PERF_DATA.departure.press_alt / 1000

   //cruise
   const PA_TO_INHG = 3386.38866666667
   document.PERF_DATA.cruise                 = {power_long: 0, power_econ: 0, power_norm: 0, speed_long: 0, speed_econ: 0, speed_norm:0, time_long: 0, time_econ: 0, time_norm:0, fuel_long: 0, fuel_econ: 0, fuel_norm:0}
   document.PERF_DATA.cruise.isa_temp_diff   = document.FP_DATA.cruise.oat - 15 + 2 * document.FP_DATA.cruise.altitude / 1000
   document.PERF_DATA.cruise.Patm            = (1013-30*document.FP_DATA.cruise.altitude/1000)*100 / PA_TO_INHG

   //destination
   document.PERF_DATA.arrival = {press_alt: 0, headwind: 0, tailwind: 0, isa_temp_diff: 0}
   document.PERF_DATA.arrival.press_alt       = document.FP_DATA.arr.elevation + 30 * (1013 - document.FP_DATA.arr.qnh)
   document.PERF_DATA.arrival.headwind        = Math.cos(degree_to_radian(document.FP_DATA.arr.winddir - document.FP_DATA.arr.rwytrack)) * document.FP_DATA.dep.windspeed
   document.PERF_DATA.arrival.tailwind        = -1 * Math.cos(degree_to_radian(document.FP_DATA.arr.winddir - document.FP_DATA.arr.rwytrack)) * document.FP_DATA.dep.windspeed
   document.PERF_DATA.arrival.isa_temp_diff   = document.FP_DATA.arr.temp - 15 + 2 * document.PERF_DATA.arrival.press_alt / 1000


   //TAKE-OFF  --------------------------------------------------------------------------------
   const NORM_TO_DIST_VALS = {a: 2282.805, b: 0.0096427, c: 0.000106}
   const NORM_GROUND_ROLL_VALS = {a: 1916.6519581323, b: 0.009746260841, c: 0.000108605}
   const MAX_TO_DIST_VALS = {a: 1545.112907, b: 0.009225654, c: 0.000105554}
   const MAX_GROUND_ROLL_VALS = {a: 1034.592151, b: 0.00979832, c: 0.000107094}
   const WEIGHT_CORR_VALS = {a: -0.6, b: 0.0004444}
   const HEADWIND_CORR_VALS = {a: 0.01}
   const TAILWIND_CORR_VALS = {a: 0.0259524, b: 18.2142857}
   const NORM_VR_VALS = {a: 0.0139571429, b: 37.6585714285714}
   const MAX_VR_VALS = {a: 0.01, b: 36}
   const MAX_VOBST_VALS = {a: 0.0108571428571429, b: 37.9619047619048}
   const e = Math.E

   document.PERF_DATA.take_off = {norm_to_dist: 0, norm_ground_roll: 0, max_to_dist: 0, max_ground_roll: 0, norm_vr: 0, max_vr: 0, max_vobst: 0}
   
   var norm_to_dist_Datm      = Math.ceil(NORM_TO_DIST_VALS.a * (e ** (NORM_TO_DIST_VALS.b * document.FP_DATA.dep.temp)) * (e ** (NORM_TO_DIST_VALS.c * document.PERF_DATA.departure.press_alt)) / 50) * 50
   var norm_ground_roll_Datm  = Math.ceil(NORM_GROUND_ROLL_VALS.a * (e ** (NORM_GROUND_ROLL_VALS.b * document.FP_DATA.dep.temp)) * (e ** (NORM_GROUND_ROLL_VALS.c * document.PERF_DATA.departure.press_alt)) / 50) * 50
   var max_to_dist_Datm       = Math.ceil(MAX_TO_DIST_VALS.a * (e ** (MAX_TO_DIST_VALS.b * document.FP_DATA.dep.temp)) * (e ** (MAX_TO_DIST_VALS.c * document.PERF_DATA.departure.press_alt)) / 50) * 50
   var max_ground_roll_Datm   = Math.ceil(MAX_GROUND_ROLL_VALS.a * (e ** (MAX_GROUND_ROLL_VALS.b * document.FP_DATA.dep.temp)) * (e ** (MAX_GROUND_ROLL_VALS.c * document.PERF_DATA.departure.press_alt)) / 50) * 50

   var norm_to_dist_Dweight      = Math.ceil((document.WNB_data.to_weight * WEIGHT_CORR_VALS.b * norm_to_dist_Datm + WEIGHT_CORR_VALS.a * norm_to_dist_Datm) / 50) * 50
   var norm_ground_roll_Dweight  = Math.ceil((document.WNB_data.to_weight * WEIGHT_CORR_VALS.b * norm_ground_roll_Datm + WEIGHT_CORR_VALS.a * norm_ground_roll_Datm) / 50) * 50
   var max_to_dist_Dweight       = Math.ceil((document.WNB_data.to_weight * WEIGHT_CORR_VALS.b * max_to_dist_Datm + WEIGHT_CORR_VALS.a * max_to_dist_Datm) / 50) * 50
   var max_ground_roll_Dweight   = Math.ceil((document.WNB_data.to_weight * WEIGHT_CORR_VALS.b * max_ground_roll_Datm + WEIGHT_CORR_VALS.a * max_ground_roll_Datm) / 50) * 50

   var norm_to_dist_CorrHW       = HEADWIND_CORR_VALS.a * document.PERF_DATA.departure.headwind * norm_to_dist_Dweight
   var norm_ground_roll_CorrHW   = HEADWIND_CORR_VALS.a * document.PERF_DATA.departure.headwind * norm_ground_roll_Dweight
   var max_to_dist_CorrHW        = HEADWIND_CORR_VALS.a * document.PERF_DATA.departure.headwind * max_to_dist_Dweight
   var max_ground_roll_CorrHW    = HEADWIND_CORR_VALS.a * document.PERF_DATA.departure.headwind * max_ground_roll_Dweight

   var norm_to_dist_CorrTW       = (TAILWIND_CORR_VALS.a * norm_to_dist_Dweight + TAILWIND_CORR_VALS.b) * document.PERF_DATA.departure.tailwind
   var norm_ground_roll_CorrTW   = (TAILWIND_CORR_VALS.a * norm_ground_roll_Dweight + TAILWIND_CORR_VALS.b) * document.PERF_DATA.departure.tailwind
   var max_to_dist_CorrTW        = (TAILWIND_CORR_VALS.a * max_to_dist_Dweight + TAILWIND_CORR_VALS.b) * document.PERF_DATA.departure.tailwind
   var max_ground_roll_CorrTW    = (TAILWIND_CORR_VALS.a * max_ground_roll_Dweight + TAILWIND_CORR_VALS.b) * document.PERF_DATA.departure.tailwind

   document.PERF_DATA.take_off.norm_to_dist     = Math.ceil((norm_to_dist_Dweight + norm_to_dist_CorrHW + norm_to_dist_CorrTW) / 50) * 50
   document.PERF_DATA.take_off.norm_ground_roll = Math.ceil((norm_ground_roll_Dweight + norm_ground_roll_CorrHW + norm_ground_roll_CorrTW) / 50) * 50
   document.PERF_DATA.take_off.max_to_dist      = Math.ceil((max_to_dist_Dweight + max_to_dist_CorrHW + max_to_dist_CorrTW) / 50) * 50
   document.PERF_DATA.take_off.max_ground_roll  = Math.ceil((max_ground_roll_Dweight + max_ground_roll_CorrHW + max_ground_roll_CorrTW) / 50) * 50

   document.PERF_DATA.take_off.norm_vr    = Math.ceil(document.WNB_data.to_weight * NORM_VR_VALS.a + NORM_VR_VALS.b)
   document.PERF_DATA.take_off.max_vr     = Math.ceil(document.WNB_data.to_weight * MAX_VR_VALS.a + MAX_VR_VALS.b)
   document.PERF_DATA.take_off.max_vobst  = Math.ceil(document.WNB_data.to_weight * MAX_VOBST_VALS.a + MAX_VOBST_VALS.b)


   //CLIMB===========================================================================================
   const CLIMB_RATE_VALS   =  {
      a: (7.17556759546148 * (10 ** -12)), 
      b: (-4.1960139318886 * (10 ** -9)), 
      c: (9.11526057791538 * (10 ** -7)),
      d: (-1.95151251289991 * (10 ** -6)), 
      e: 0.000545598232714139, 
      f: -0.0969869904540764, 
      g: 0, 
      h: -12.7603353973168, 
      i: 1314.9209494324
   }
   const CLIMB_TIME_VALS   = {
      a: (3.33508403361345 * (10 ** -9)), 
      b: (1.12394957983193 * (10 ** -7)), 
      c: -0.0000164233193277311,
      d: 0.000169957983193277, 
      e: 0.024080882,
      f: 1.014705882
   }
   const CLIMB_FUEL_VALS = {
      a: (1.11169467787115 * (10 ** -9)),
      b: (2.98202614379085 * (10 ** -8)),
      c: (-4.98424369747899 * (10 ** -6)),
      d: 0.000290441,
      e: 0.00435049,
      f: 0.448120915
   }
   const CLIMB_DIST_VALS = {
      a: (3.96533613445378 * (10 ** -9)),
      b: (2.24031279178338 * (10 ** -7)),
      c: -0.0000235241596638655,
      d: -0.0000678221288515405,
      e: 0.047242647058823,
      f: 1.83374183006536
   }

   document.PERF_DATA.climb = {}

   //climb rate
   var climb_rate_dep_a = CLIMB_RATE_VALS.a * (document.FP_DATA.dep.temp ** 2) + CLIMB_RATE_VALS.b * document.FP_DATA.dep.temp + CLIMB_RATE_VALS.c
   var climb_rate_dep_b = CLIMB_RATE_VALS.d * (document.FP_DATA.dep.temp ** 2) + CLIMB_RATE_VALS.e * document.FP_DATA.dep.temp + CLIMB_RATE_VALS.f
   var climb_rate_dep_c = CLIMB_RATE_VALS.g * (document.FP_DATA.dep.temp ** 2) + CLIMB_RATE_VALS.h * document.FP_DATA.dep.temp + CLIMB_RATE_VALS.i

   var climb_rate_cruise_a = CLIMB_RATE_VALS.a * (document.FP_DATA.cruise.oat ** 2) + CLIMB_RATE_VALS.b * document.FP_DATA.cruise.oat + CLIMB_RATE_VALS.c
   var climb_rate_cruise_b = CLIMB_RATE_VALS.d * (document.FP_DATA.cruise.oat ** 2) + CLIMB_RATE_VALS.e * document.FP_DATA.cruise.oat + CLIMB_RATE_VALS.f
   var climb_rate_cruise_c = CLIMB_RATE_VALS.g * (document.FP_DATA.cruise.oat ** 2) + CLIMB_RATE_VALS.h * document.FP_DATA.cruise.oat + CLIMB_RATE_VALS.i

   document.PERF_DATA.climb.climb_rate_dep = Math.round((climb_rate_dep_a * document.PERF_DATA.departure.press_alt ** 2 + climb_rate_dep_b * document.PERF_DATA.departure.press_alt + climb_rate_dep_c) / 10) * 10
   document.PERF_DATA.climb.climb_rate_cruise = Math.round((climb_rate_cruise_a * document.FP_DATA.cruise.altitude ** 2 + climb_rate_cruise_b * document.FP_DATA.cruise.altitude + climb_rate_cruise_c) / 10) * 10

   //climb time
   var climb_time_top_a = CLIMB_TIME_VALS.a * document.PERF_DATA.cruise.isa_temp_diff + CLIMB_TIME_VALS.b
   var climb_time_top_b = CLIMB_TIME_VALS.c * document.PERF_DATA.cruise.isa_temp_diff + CLIMB_TIME_VALS.d
   var climb_time_top_c = CLIMB_TIME_VALS.e * document.PERF_DATA.cruise.isa_temp_diff + CLIMB_TIME_VALS.f
   var climb_time_top   = Math.round(climb_time_top_a * document.FP_DATA.cruise.altitude**2 + climb_time_top_b * document.FP_DATA.cruise.altitude + climb_time_top_c) 

   var climb_time_bottom_a = CLIMB_TIME_VALS.a * document.PERF_DATA.departure.isa_temp_diff + CLIMB_TIME_VALS.b
   var climb_time_bottom_b = CLIMB_TIME_VALS.c * document.PERF_DATA.departure.isa_temp_diff + CLIMB_TIME_VALS.d
   var climb_time_bottom_c = CLIMB_TIME_VALS.e * document.PERF_DATA.departure.isa_temp_diff + CLIMB_TIME_VALS.f
   var climb_time_bottom   = Math.round(climb_time_bottom_a * document.PERF_DATA.departure.press_alt**2 + climb_time_bottom_b * document.PERF_DATA.departure.press_alt + climb_time_bottom_c) 

   document.PERF_DATA.climb.time = climb_time_top - climb_time_bottom

   //climb fuel
   var climb_fuel_top_a = CLIMB_FUEL_VALS.a * document.PERF_DATA.cruise.isa_temp_diff + CLIMB_FUEL_VALS.b
   var climb_fuel_top_b = CLIMB_FUEL_VALS.c * document.PERF_DATA.cruise.isa_temp_diff + CLIMB_FUEL_VALS.d
   var climb_fuel_top_c = CLIMB_FUEL_VALS.e * document.PERF_DATA.cruise.isa_temp_diff + CLIMB_FUEL_VALS.f
   var climb_fuel_top   = roundup(climb_fuel_top_a * document.FP_DATA.cruise.altitude**2 + climb_fuel_top_b * document.FP_DATA.cruise.altitude + climb_fuel_top_c, 1) 

   var climb_fuel_bottom_a = CLIMB_FUEL_VALS.a * document.PERF_DATA.departure.isa_temp_diff + CLIMB_FUEL_VALS.b
   var climb_fuel_bottom_b = CLIMB_FUEL_VALS.c * document.PERF_DATA.departure.isa_temp_diff + CLIMB_FUEL_VALS.d
   var climb_fuel_bottom_c = CLIMB_FUEL_VALS.e * document.PERF_DATA.departure.isa_temp_diff + CLIMB_FUEL_VALS.f
   var climb_fuel_bottom   = rounddown(climb_fuel_bottom_a * document.PERF_DATA.departure.press_alt**2 + climb_fuel_bottom_b * document.PERF_DATA.departure.press_alt + climb_fuel_bottom_c, 1) 

   document.PERF_DATA.climb.fuel = climb_fuel_top - climb_fuel_bottom

   //climb distance
   var climb_dist_top_a = CLIMB_DIST_VALS.a * document.PERF_DATA.cruise.isa_temp_diff + CLIMB_DIST_VALS.b
   var climb_dist_top_b = CLIMB_DIST_VALS.c * document.PERF_DATA.cruise.isa_temp_diff + CLIMB_DIST_VALS.d
   var climb_dist_top_c = CLIMB_DIST_VALS.e * document.PERF_DATA.cruise.isa_temp_diff + CLIMB_DIST_VALS.f
   var climb_dist_top   = Math.round(climb_dist_top_a * document.FP_DATA.cruise.altitude**2 + climb_dist_top_b * document.FP_DATA.cruise.altitude + climb_dist_top_c) 

   var climb_dist_bottom_a = CLIMB_DIST_VALS.a * document.PERF_DATA.departure.isa_temp_diff + CLIMB_DIST_VALS.b
   var climb_dist_bottom_b = CLIMB_DIST_VALS.c * document.PERF_DATA.departure.isa_temp_diff + CLIMB_DIST_VALS.d
   var climb_dist_bottom_c = CLIMB_DIST_VALS.e * document.PERF_DATA.departure.isa_temp_diff + CLIMB_DIST_VALS.f
   var climb_dist_bottom   = Math.round(climb_dist_bottom_a * document.PERF_DATA.departure.press_alt**2 + climb_dist_bottom_b * document.PERF_DATA.departure.press_alt + climb_dist_bottom_c) 

   document.PERF_DATA.climb.dist = climb_dist_top - climb_dist_bottom


   //DESCENT==================================================================================================
   const DESCENT_VALS = {a: 0.065625, b: (2.39955357142857 * (10 ** -7)), c: 0.00250133928571428, d: 4.47500000000002,
      fuel: 0.12,
      time: 0.4,
      dist: 0.956923076923077,
      glde: 0.3
   }

   document.PERF_DATA.descent = {}

   var descent_top = DESCENT_VALS.a * document.FP_DATA.cruise.oat + DESCENT_VALS.b * document.FP_DATA.cruise.altitude**2 + DESCENT_VALS.c * document.FP_DATA.cruise.altitude + DESCENT_VALS.d
   var descent_bottom = DESCENT_VALS.a * document.FP_DATA.arr.temp + DESCENT_VALS.b * document.PERF_DATA.arrival.press_alt**2 + DESCENT_VALS.c * document.PERF_DATA.arrival.press_alt + DESCENT_VALS.d

   var descent_fuel_top    = DESCENT_VALS.fuel * descent_top
   var descent_fuel_bottom = DESCENT_VALS.fuel * descent_bottom

   var descent_time_top    = DESCENT_VALS.time * descent_top
   var descent_time_bottom = DESCENT_VALS.time * descent_bottom

   var descent_dist_top    = DESCENT_VALS.dist * descent_top
   var descent_dist_bottom = DESCENT_VALS.dist * descent_bottom

   var descent_glde_top    = DESCENT_VALS.glde * descent_top
   var descent_glde_bottom = DESCENT_VALS.glde * descent_bottom

   document.PERF_DATA.descent.fuel = roundup(descent_fuel_top - descent_fuel_bottom, 1)
   document.PERF_DATA.descent.time = Math.round(descent_time_top - descent_time_bottom)
   document.PERF_DATA.descent.dist = Math.round(descent_dist_top - descent_dist_bottom)
   document.PERF_DATA.descent.glde = Math.floor(descent_glde_top - descent_glde_bottom)


   //CRUISE===================================================================================================
   
   const POWER_LONG_VALS = {a: -0.00465202708428329, b: -0.000291297398504554, c: 32.8376704368914}
   const POWER_ECON_VALS = {a: -0.00560274344042533, b: -0.000302687436330186, c: 37.2497977770682}
   const POWER_NORM_VALS = {a: -0.00648355656882303, b: -0.000315702479338842, c: 42.120826446281}
   
   const SPEED_LONG_VALS = {a: 0.160818872017354, b: 0.00173562906724512, c: 130.686225596529}
   const SPEED_ECON_VALS = {a: 0.182724719101124, b: 0.0018876404494382, c: 141.255617977528}
   const SPEED_NORM_VALS = {a: 0.198467144418802, b: 0.00202210615814405, c: 149.734786833475}

   const FUEL_RATE_LONG = 14.5
   const FUEL_RATE_ECON = 16.5
   const FUEL_RATE_NORM = 18.5

   var power_long = round( POWER_LONG_VALS.a * document.FP_DATA.cruise.rpm + document.FP_DATA.cruise.altitude * POWER_LONG_VALS.b + POWER_LONG_VALS.c + 0.5 * document.PERF_DATA.cruise.isa_temp_diff / 10, 1)
   var power_econ = round( POWER_ECON_VALS.a * document.FP_DATA.cruise.rpm + document.FP_DATA.cruise.altitude * POWER_ECON_VALS.b + POWER_ECON_VALS.c + 0.5 * document.PERF_DATA.cruise.isa_temp_diff / 10, 1)
   var power_norm = round( POWER_NORM_VALS.a * document.FP_DATA.cruise.rpm + document.FP_DATA.cruise.altitude * POWER_NORM_VALS.b + POWER_NORM_VALS.c + 0.5 * document.PERF_DATA.cruise.isa_temp_diff / 10, 1)

   var speed_long = Math.round(SPEED_LONG_VALS.a * document.FP_DATA.cruise.oat + document.FP_DATA.cruise.altitude * SPEED_LONG_VALS.b + SPEED_LONG_VALS.c)
   var speed_econ = Math.round(SPEED_ECON_VALS.a * document.FP_DATA.cruise.oat + document.FP_DATA.cruise.altitude * SPEED_ECON_VALS.b + SPEED_ECON_VALS.c)
   var speed_norm = Math.round(SPEED_NORM_VALS.a * document.FP_DATA.cruise.oat + document.FP_DATA.cruise.altitude * SPEED_NORM_VALS.b + SPEED_NORM_VALS.c)

   document.PERF_DATA.cruise.dist = document.FP_DATA.cruise.tripdistance - document.PERF_DATA.climb.dist - document.PERF_DATA.descent.dist

   if (power_long <= document.PERF_DATA.cruise.Patm){
      document.PERF_DATA.cruise.power_long = power_long
      document.PERF_DATA.cruise.speed_long = speed_long
      document.PERF_DATA.cruise.time_long  = Math.round(document.PERF_DATA.cruise.dist / document.PERF_DATA.cruise.speed_long * 60)
      document.PERF_DATA.cruise.fuel_long  = roundup(document.PERF_DATA.cruise.time_long * FUEL_RATE_LONG / 24 , 1)
   }
   if (power_econ <= document.PERF_DATA.cruise.Patm){
      document.PERF_DATA.cruise.power_econ = power_econ
      document.PERF_DATA.cruise.speed_econ = speed_econ
      document.PERF_DATA.cruise.time_econ  = Math.round(document.PERF_DATA.cruise.dist / document.PERF_DATA.cruise.speed_econ * 60)
      document.PERF_DATA.cruise.fuel_econ  = roundup(document.PERF_DATA.cruise.time_econ * FUEL_RATE_ECON / 24 , 1)
      }
   if (power_norm <= document.PERF_DATA.cruise.Patm){
      document.PERF_DATA.cruise.power_norm = power_norm
      document.PERF_DATA.cruise.speed_norm = speed_norm
      document.PERF_DATA.cruise.time_norm  = Math.round(document.PERF_DATA.cruise.dist / document.PERF_DATA.cruise.speed_norm * 60)
      document.PERF_DATA.cruise.fuel_norm  = roundup(document.PERF_DATA.cruise.time_norm * FUEL_RATE_NORM / 24 , 1)
   }

   //TOTALS===============================================================================================
   document.PERF_DATA.totals = {}

   const TAXI_FUEL = 2

   document.PERF_DATA.totals.trip_fuel = roundup(document.PERF_DATA.climb.fuel + document.PERF_DATA.descent.fuel + document.PERF_DATA.cruise.fuel_econ, 1)
   document.PERF_DATA.totals.burnoff  = roundup(document.PERF_DATA.totals.trip_fuel + TAXI_FUEL, 1)

   document.PERF_DATA.totals.trip_time = document.PERF_DATA.climb.time + document.PERF_DATA.descent.time + document.PERF_DATA.cruise.time_econ

   document.PERF_DATA.totals.cont_fuel       = Math.round(document.PERF_DATA.totals.trip_fuel * document.FP_DATA.config.cont_fuel / 100)
   document.PERF_DATA.totals.cont_fuel_time  = document.PERF_DATA.totals.cont_fuel / FUEL_RATE_ECON / 24
   document.PERF_DATA.totals.alt_fuel        = document.FP_DATA.config.alt_fuel
   document.PERF_DATA.totals.alt_fuel_time   = document.PERF_DATA.totals.alt_fuel / FUEL_RATE_ECON / 24
   document.PERF_DATA.totals.hold_fuel_time  = document.FP_DATA.config.hold_fuel
   document.PERF_DATA.totals.hold_fuel       = Math.ceil(document.PERF_DATA.totals.hold_fuel_time * FUEL_RATE_ECON / 60)
   document.PERF_DATA.totals.app_time        = document.FP_DATA.config.app_time
   document.PERF_DATA.totals.app_fuel        = Math.ceil(document.PERF_DATA.totals.app_time * FUEL_RATE_ECON / 60)
   document.PERF_DATA.totals.min_required    = document.PERF_DATA.totals.burnoff + document.PERF_DATA.totals.cont_fuel + document.PERF_DATA.totals.alt_fuel + document.PERF_DATA.totals.hold_fuel + document.PERF_DATA.totals.app_fuel
   document.PERF_DATA.totals.min_required_time = document.PERF_DATA.totals.trip_time + document.PERF_DATA.totals.cont_fuel_time + document.PERF_DATA.totals.alt_fuel_time + document.PERF_DATA.totals.hold_fuel_time
   document.PERF_DATA.totals.extra_fuel      = document.FP_DATA.config.block_fuel - document.PERF_DATA.totals.min_required
   document.PERF_DATA.totals.extra_fuel_time = Math.round(document.PERF_DATA.totals.extra_fuel / FUEL_RATE_ECON * 60)
   document.PERF_DATA.totals.max_extra       = 102 - document.PERF_DATA.totals.min_required
   document.PERF_DATA.totals.max_extra_time  = Math.round(document.PERF_DATA.totals.max_extra / FUEL_RATE_ECON * 60)
   document.PERF_DATA.totals.block_fuel      = document.FP_DATA.config.block_fuel
   document.PERF_DATA.totals.block_fuel_time = document.PERF_DATA.totals.min_required_time + document.PERF_DATA.totals.extra_fuel_time


   //LANDING==============================================================================================

   const LANDING_DIST_VALS = {a: 4.56027857709245, b: 0.0453685810322214, c: 1458.99867344242}
   const GROUND_ROLL_VALS = {a: 2.56310852506596, b: 0.0262862036497927, c: 603.12481765561}
   const WEIGHT_COEFF = 0.1
   const HEADWIND_CORR = -16
   const TAILWIND_CORR = 52
   const APPROACH_SPEED_VALS = {a: 0.004, b: 65.6}

   document.PERF_DATA.landing = {landing_distance: 0, ground_roll: 0, approach_speed: 0}

   document.WNB_data.landing_weight = document.WNB_data.to_weight - document.PERF_DATA.totals.burnoff

   var landing_dist_a = LANDING_DIST_VALS.a * document.FP_DATA.arr.temp + LANDING_DIST_VALS.b * document.PERF_DATA.arrival.press_alt + LANDING_DIST_VALS.c
   var landing_dist_b = landing_dist_a - (3600 - document.WNB_data.landing_weight) * WEIGHT_COEFF

   var ground_roll_a = GROUND_ROLL_VALS.a * document.FP_DATA.arr.temp + GROUND_ROLL_VALS.b * document.PERF_DATA.arrival.press_alt + GROUND_ROLL_VALS.c
   var ground_roll_b = ground_roll_a - (3600 - document.WNB_data.landing_weight) * WEIGHT_COEFF

   var headwind_corr = document.PERF_DATA.arrival.headwind * HEADWIND_CORR
   var tailwind_corr = document.PERF_DATA.arrival.tailwind * TAILWIND_CORR

   document.PERF_DATA.landing.landing_distance = Math.ceil((landing_dist_b + tailwind_corr) / 50) * 50
   document.PERF_DATA.landing.ground_roll      = Math.ceil((ground_roll_b + tailwind_corr) / 50) * 50

   document.PERF_DATA.landing.approach_speed = Math.ceil(document.WNB_data.landing_weight * APPROACH_SPEED_VALS.a + APPROACH_SPEED_VALS.b)


   //data calculated = true
   document.performance = true
   console.log(document.PERF_DATA, document.performance)
   console.log(document.FP_DATA)
   console.log(document.WNB_data)
}


//==========================================================================

//script take_off page
function TakeOff(){
   //MENU button
   $("#back").click(function(){
      $.get("html/main_menu.html", function(content){
         document.querySelector('.content').innerHTML = content;
         mainMenu();
      }, 'html')
   });
   //next phase button
   $("#next").click(function(){
      $.get("html/climb.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Climb();
      }, 'html')
   });

   //set fields
   if (document.performance == true){
      document.getElementById("to-dist").innerHTML = document.PERF_DATA.take_off.norm_to_dist + ' / ' + document.PERF_DATA.take_off.max_to_dist
      document.getElementById("ground-roll").innerHTML = document.PERF_DATA.take_off.norm_ground_roll + ' / ' + document.PERF_DATA.take_off.max_ground_roll
      document.getElementById("lift-off").innerHTML = document.PERF_DATA.take_off.norm_vr + ' / ' + document.PERF_DATA.take_off.max_vr
      document.getElementById("obstacle-speed").innerHTML = document.PERF_DATA.take_off.norm_vr + ' / ' + document.PERF_DATA.take_off.max_vobst
   
   }
}

//script climb page
function Climb(){
   //MENU button
   $("#back").click(function(){
      $.get("html/main_menu.html", function(content){
         document.querySelector('.content').innerHTML = content;
         mainMenu();
      }, 'html')
   });
   //previous phase button
   $("#previous").click(function(){
      $.get("html/take_off.html", function(content){
         document.querySelector('.content').innerHTML = content;
         TakeOff();
      }, 'html')
   });
   $("#next").click(function(){
      $.get("html/cruise.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Cruise();
      }, 'html')
   });

   //set fields
   if (document.performance == true){
      document.getElementById("climb-rate-adep").innerHTML = document.PERF_DATA.climb.climb_rate_dep
      document.getElementById("climb-rate-cruise").innerHTML = document.PERF_DATA.climb.climb_rate_cruise
      document.getElementById("climb-time").innerHTML = document.PERF_DATA.climb.time
      document.getElementById("climb-fuel").innerHTML = document.PERF_DATA.climb.fuel
      document.getElementById("climb-distance").innerHTML = document.PERF_DATA.climb.dist
   
   }
}

//script cruise page
function Cruise(){
   //MENU button
   $("#back").click(function(){
      $.get("html/main_menu.html", function(content){
         document.querySelector('.content').innerHTML = content;
         mainMenu();
      }, 'html')
   });
   //previous phase button
   $("#previous").click(function(){
      $.get("html/climb.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Climb();
      }, 'html')
   });
   $("#next").click(function(){
      $.get("html/descent.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Descent();
      }, 'html')
   });

   //set fields
   if (document.performance == true){
      document.getElementById("power").innerHTML = document.PERF_DATA.cruise.power_long + ' / ' + document.PERF_DATA.cruise.power_econ + ' / ' + document.PERF_DATA.cruise.power_norm
      document.getElementById("ff").innerHTML = 14.5 + ' / ' + 16.5 + ' / ' + 18.5
      document.getElementById("speed").innerHTML = document.PERF_DATA.cruise.speed_long + ' / ' + document.PERF_DATA.cruise.speed_econ + ' / ' + document.PERF_DATA.cruise.speed_norm
      document.getElementById("distance").innerHTML = document.PERF_DATA.cruise.dist
      document.getElementById("time").innerHTML = ('0' + Math.floor(document.PERF_DATA.cruise.time_long / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.cruise.time_long % 60)).slice(-2) + ' / ' + ('0' + Math.floor(document.PERF_DATA.cruise.time_econ / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.cruise.time_econ % 60)).slice(-2) + ' / ' + ('0' + Math.floor(document.PERF_DATA.cruise.time_norm / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.cruise.time_norm % 60)).slice(-2)
      document.getElementById("fuel").innerHTML = document.PERF_DATA.cruise.fuel_long + ' / ' + document.PERF_DATA.cruise.fuel_econ + ' / ' + document.PERF_DATA.cruise.fuel_norm
   
   }
}

//script descent page
function Descent(){
   //MENU button
   $("#back").click(function(){
      $.get("html/main_menu.html", function(content){
         document.querySelector('.content').innerHTML = content;
         mainMenu();
      }, 'html')
   });
   //previous phase button
   $("#previous").click(function(){
      $.get("html/cruise.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Cruise();
      }, 'html')
   });
   $("#next").click(function(){
      $.get("html/landing.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Landing();
      }, 'html')
   });

   if (document.performance == true){
      document.getElementById("time").innerHTML = ('0' + Math.floor(document.PERF_DATA.descent.time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.descent.time % 60)).slice(-2)
      document.getElementById("fuel").innerHTML = document.PERF_DATA.descent.fuel
      document.getElementById("distance").innerHTML = document.PERF_DATA.descent.dist
      document.getElementById("glide-range").innerHTML = document.PERF_DATA.descent.glde
   }
}

//script landing page
function Landing(){
   //MENU button
   $("#back").click(function(){
      $.get("html/main_menu.html", function(content){
         document.querySelector('.content').innerHTML = content;
         mainMenu();
      }, 'html')
   });
   //previous phase button
   $("#previous").click(function(){
      $.get("html/descent.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Descent();
      }, 'html')
   });
   $("#next").click(function(){
      $.get("html/totals.html", function(content){
         document.querySelector('.content').innerHTML = content;
         Totals();
      }, 'html')
   });

   if (document.performance == true){
      document.getElementById("distance").innerHTML = document.PERF_DATA.landing.landing_distance
      document.getElementById("ground-roll").innerHTML = document.PERF_DATA.landing.ground_roll
      document.getElementById("app-speed").innerHTML = document.PERF_DATA.landing.approach_speed
   }
}

//script totals page
function Totals(){
   //MENU button
   $("#back").click(function(){
      $.get("html/main_menu.html", function(content){
         document.querySelector('.content').innerHTML = content;
         mainMenu();
      }, 'html')
   });

   if (document.performance == true){
      document.getElementById("climb").innerHTML = document.PERF_DATA.climb.fuel + ' / ' + ('0' + Math.floor(document.PERF_DATA.climb.time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.climb.time % 60)).slice(-2)
      document.getElementById("cruise").innerHTML = document.PERF_DATA.cruise.fuel_econ + ' / ' + ('0' + Math.floor(document.PERF_DATA.cruise.time_econ / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.cruise.time_econ % 60)).slice(-2)
      document.getElementById("descent").innerHTML = document.PERF_DATA.descent.fuel + ' / ' + ('0' + Math.floor(document.PERF_DATA.descent.time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.descent.time % 60)).slice(-2)
      document.getElementById("totals").innerHTML = document.PERF_DATA.totals.trip_fuel + ' / ' + ('0' + Math.floor(document.PERF_DATA.totals.trip_time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.totals.trip_time % 60)).slice(-2)
      document.getElementById("taxi").innerHTML = 2
      document.getElementById("burn-off").innerHTML = document.PERF_DATA.totals.burnoff
      document.getElementById("contingency").innerHTML = document.PERF_DATA.totals.cont_fuel + ' / ' + ('0' + Math.floor(document.PERF_DATA.totals.cont_fuel_time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.totals.cont_fuel_time % 60)).slice(-2)
      document.getElementById("alternate").innerHTML = document.PERF_DATA.totals.alt_fuel + ' / ' + ('0' + Math.floor(document.PERF_DATA.totals.alt_fuel_time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.totals.alt_fuel_time % 60)).slice(-2)
      document.getElementById("holding").innerHTML = document.PERF_DATA.totals.hold_fuel + ' / ' + ('0' + Math.floor(document.PERF_DATA.totals.hold_fuel_time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.totals.hold_fuel_time % 60)).slice(-2)
      document.getElementById("approach").innerHTML = document.PERF_DATA.totals.app_fuel + ' / ' + ('0' + Math.floor(document.PERF_DATA.totals.app_time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.totals.app_time % 60)).slice(-2)
      document.getElementById("min-required").innerHTML = document.PERF_DATA.totals.min_required + ' / ' + ('0' + Math.floor(document.PERF_DATA.totals.min_required_time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.totals.min_required_time % 60)).slice(-2)
      document.getElementById("extra-fuel").innerHTML = document.PERF_DATA.totals.extra_fuel + ' / ' + ('0' + Math.floor(document.PERF_DATA.totals.extra_fuel_time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.totals.extra_fuel_time % 60)).slice(-2)
      document.getElementById("max-extra").innerHTML = document.PERF_DATA.totals.max_extra + ' / ' + ('0' + Math.floor(document.PERF_DATA.totals.max_extra_time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.totals.max_extra_time % 60)).slice(-2)
      document.getElementById("block-fuel").innerHTML = document.PERF_DATA.totals.block_fuel + ' / ' + ('0' + Math.floor(document.PERF_DATA.totals.block_fuel_time / 60)).slice(-2) + ':' + ('0' + (document.PERF_DATA.totals.block_fuel_time % 60)).slice(-2)

      
   }
}


//dropdown
function depRWY() {
   var selection = []
   for(var i in document.runways){
      if (document.runways[i].airport_ident === document.FP_DATA.dep.icao){
         selection.push(document.runways[i])
      }
   }
   var HTML = ""
   for(var i in selection){
      HTML += "<a href='#' class='rwy-select'>" + selection[i].le_ident + "</a>"
      HTML += "<a href='#' class='rwy-select'>" + selection[i].he_ident + "</a>"
   }

   document.getElementById("depRWY").innerHTML = HTML

   document.getElementById("depRWY").classList.toggle("show");

   $('.rwy-select').click(function(){
      var rwy = document.querySelectorAll( ":hover" )[10].text
      var rwy_obj = {}
      var le = true

      for (var k in selection){
         if (selection[k].le_ident === rwy){
            rwy_obj = selection[k]
            le = true
         }else if (selection[k].he_ident === rwy){
            rwy_obj = selection[k]
            le = false
         }
      }

      console.log(rwy_obj, le)
   })
}

function arrRWY() {
   var selection = []
   for(var i in document.runways){
      if (document.runways[i].airport_ident === document.FP_DATA.arr.icao){
         selection.push(document.runways[i])
      }
   }
   var HTML = ""
   for(var i in selection){
      HTML += "<a href='#' class='rwy-select'>" + selection[i].le_ident + "</a>"
      HTML += "<a href='#' class='rwy-select'>" + selection[i].he_ident + "</a>"
   }

   document.getElementById("arrRWY").innerHTML = HTML
   document.getElementById("arrRWY").classList.toggle("show");
}



//make dropdown go away
window.onclick = function(event) {
   if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
         var openDropdown = dropdowns[i];
         if (openDropdown.classList.contains('show')) {
         openDropdown.classList.remove('show');
         }
      }
   }
} 

