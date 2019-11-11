$(document).ready(function(){
  $(".category-container").mCustomScrollbar({
    setWidth: false
  });
  $(".category-grid-container").mCustomScrollbar({
    setWidth: false
  });
  var lazyLoadInstance1 = new LazyLoad({
      elements_selector: ".lazy",
      load_delay: 300,
      container: document.getElementById('categoryGridContainer')
  });
  var lazyLoadInstance2 = new LazyLoad({
      elements_selector: ".lazy",
      load_delay: 300,
      container: document.getElementById('categoryContainer')
  });
});

$('.category-card').on('click',function(){
  try{
    var categoryName = $(this).data('name');
    categoryCheck(categoryName);
  }catch(error){
    console.log(error);
  }
});

$("#custom-search-input input").on('keydown keyup change', function(){
  try{
    var searchValue = $(this).val();
    if(searchValue.length != 0){
      receipeSearch(searchValue);
    }else{
      categoryCheck('Beef');
    }
  }catch(error){
    console.log(error);
  }
});

$(window).on('load',function() {
    $('.loading').hide();
});

function receipeSearch(searchValue){
    try {
      var storeSources = [];
      $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        item.label = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a>" + item.label + "</a>")
          .appendTo(ul);
      };

    $("#custom-search-input input").autocomplete({
      highlightClass: "bold-text",
      open: function (event, ui) {
        $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
        $(".ui-autocomplete").mCustomScrollbar({
						setWidth: false,
            theme:"dark-thick"
				});
      },
      search: function (event, ui) {

      },
      source: function (request, response) {
        $.ajax({
          type: "GET",
          url: "https://www.themealdb.com/api/json/v1/1/search.php",
          data: {
            s:searchValue
          },
          success: function (data) {
            storeSources = [];
            $.each(data.meals, function (key, item) {
              var searchObj = {};
              searchObj["value"] = item.strMeal;
              searchObj["id"] = item.idMeal;
              searchObj["image"] = item.strMealThumb;
              storeSources.push(searchObj);
            });
            response(storeSources);
          }
        });
      },
      minLength: 2,
      select: function (event, ui) {
        console.log(ui.item);
        $('.category-grid-container').mCustomScrollbar("destroy");
        var returnedData = '<div class="row">';
        returnedData += '<div class="col-lg-4">';
        returnedData += '<a class="card mb-4 text-white category-grid-card" href="/receipe/'+ui.item.id+'">';
        returnedData += '<img class="card-img-top" src="'+ui.item.image+'" alt="receipes">';
        returnedData += '<div class="overlay"><div class="text">'+ui.item.value+'</div></div>';
        returnedData += '</a></div></div>';
        $('.category-grid-container').empty().append(returnedData);
        $('.category-grid-container').mCustomScrollbar({
          setWidth: false
        });
      },
      response: function (event, ui) {
          /* destroy the scrollbar after each search completes, before the menu is shown */
					$(".ui-autocomplete").mCustomScrollbar("destroy");
      },
      close:function(e,ui){
				/* destroy the scrollbar each time autocomplete menu closes */
				$(".ui-autocomplete").mCustomScrollbar("destroy");
			}
    });

  } catch (error) {
    console.log(error);
  }
}

function categoryCheck(categoryName){
  try{
    $.getJSON("https://www.themealdb.com/api/json/v1/1/filter.php", {c: categoryName}, function(result){
      $('.category-grid-container').mCustomScrollbar("destroy");
      var returnedData = '<div class="row">';
      $.each(result,function(key,item){
        $.each(item,function(innerKey,innerItem){
          returnedData += '<div class="col-lg-4">';
          returnedData += '<a class="card mb-4 text-white category-grid-card" href="/receipe/'+innerItem.idMeal
          +'">';
          returnedData += '<img class="card-img-top" src="'+innerItem.strMealThumb+'" alt="receipes">';
          returnedData += '<div class="overlay"><div class="text">'+innerItem.strMeal+'</div></div>';
          returnedData += '</a></div>'
        });
      });
      returnedData += '</div>';
      $('.category-grid-container').empty().append(returnedData);
      $('.category-grid-container').mCustomScrollbar({
        setWidth: false
      });
    });
  }catch(error){
    console.log(error);
  }
}
