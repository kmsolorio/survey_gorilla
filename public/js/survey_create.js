
$(document).ready(function(){
  var $newQuestion = $('#new-question'),
      $create      = $('#create'),
      $addOption   = $('#add-option'),
      $options     = $('#options'),
      $responses   = $('#responses');

  $newQuestion.hide();
  $create.hide();
  $addOption.hide();
  $options.hide();
  $responses.hide();

  $('#add').on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    $('#add-question').hide();
    $newQuestion.show();

    $('#type').on('change', function(event){
      event.stopPropagation();
      $create.show();
      var type = $(this).val();

      if (type == 'TextArea' || type == 'NumSlider' || type == 'PercentSlider' || type == 'ShortResponse') {
        $addOption.hide();
        $('#options p').remove();
        $options.hide();
        $responses.hide();
      }

      if (type == 'McRadio' || type == 'McCheck') {
        $addOption.show();
        $options.show();
        $responses.hide();

        $addOption.off();
        $addOption.on('click', function(event){
          event.stopPropagation();
          $options.append($('<p id="option"><input type="text" name="response" placeholder="Option"><button id="remove">Remove</button></p>'));
        });
        $options.on('click', '#remove', function(event){
          event.stopPropagation();
          $(this).parent().remove();
        });
      }
    });

    $create.off();
    $create.on('click', function(event){
      event.stopPropagation();
      var url = $('#define').attr('action');
      var responses = [];

      $('#options p input[name="response"]').each(function(){
        responses.push($(this).val());
      });

      var data = {question: {}};
      data['question']['type'] = $('#type').val();
      data['question']['text'] = $('#text').val();
      data['responses'] = responses;
      console.log(url);

      $.post(url, data, function(response){
        $('#questions').append(response);
      });

      resetForm();
    });
  });

  $('#delete').off();
  $('#delete').on('submit', function(event){
    event.preventDefault();
    event.stopPropagation();
    var url = $(this).attr('action');

    $(this).closest('.question').parent().remove();
    $.post(url);
  });

  $('.chart').off();
  $('.chart').on('submit', function(event){
    event.preventDefault();
    event.stopPropagation();
    $(this).hide();

    var that = $(this);
    var id = $(this).attr('id');
    var url = $(this).attr('action');

    $.get(url, function(response){
      that.before('<canvas id="myChart'+ id +'" width="800" height="400"></canvas>')
      var data = {
      labels : response.labels,
      datasets : [
        {
        fillColor : "rgba(65,163,13,0.5)",
        strokeColor : "rgba(65,163,13,1)",
        pointColor : "rgba(65,163,13,1)",
        pointStrokeColor : "#fff",
        data : response.data
        }
        ]
      }
      var myLine = new Chart(document.getElementById("myChart"+ id).getContext("2d")).Bar(data);
    });
  });
});

// this function is idempotent, which is great!
function resetForm(){
  $('#text').val('');
  $('#type').val('');
  $newQuestion.hide();
  $('#add-question').show();
  $('#create').hide();
  $('#add-option').hide();
  $('#options p').remove();
}
