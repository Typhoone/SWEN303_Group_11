(function(document) {
  'use strict';

  var app = document.querySelector('#app');
  window.addEventListener('WebComponentsReady', function() {


        var noSearch = true; 
    var searchField = document.getElementById('search');
    var searchedFor = document.getElementById('searchedFor');
    var searchResultsContainer = document.getElementById('searchResultsContainer');
    var noSearch = document.getElementById('emptySearchMessage');
    var previousSearch = '';

   var collapseToggled = false;
    var collapse = document.getElementById('collapse');

    var animationDelay = 500;


    app.toggle = function(){
      collapseToggled = !collapseToggled;
      collapse.toggle();
    }

      app.ensureCollapsed = function(){
      if(collapseToggled){app.toggle();}
    }

    app.ensureOpened = function(){
     if(!collapseToggled){app.toggle();} 
   }

   app.query = function(text){
      //TODO search the database.
    }

    app.connectToDatabase = function(){
      //TODO connect to database.
    }

    app.displayResults = function(){
      //TODO display the results which will be in a JSON format of our choosing.
    }

    app.signIn= function(){
      //TODO Imperatively create a sign-in dialog box and appropriate sanity checks.
    }

    app.signUp = function(){
      //TODO Imperatively create a sign-up dialog box and perform sanity checks.
    }

    app.search = function(){
      var currentSearch = searchField.value;
      console.log('\''+currentSearch+'\'');
      console.log(currentSearch == '');
      app.ensureCollapsed();
      if(currentSearch == previousSearch){
        if(!collapseToggled){
          app.toggle();
        }
      }else if(currentSearch == ''){
        setTimeout(function(){ 
          collapse.innerHTML = noSearch.innerHTML;
          app.ensureOpened();
        }, animationDelay);
      }else{
        var results = app.query(currentSearch);
        searchedFor.innerHTML = currentSearch;
        collapse.innerHTML = searchResultsContainer.innerHTML;
        setTimeout(function(){ 
          app.displayResults(results);
          app.ensureOpened();
        }, animationDelay);
      }
      previousSearch = currentSearch;
    }

    //After everything is loaded and finished run these methods.

  });  
})(document);

