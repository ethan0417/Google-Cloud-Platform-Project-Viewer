$(document).ready(function(){
  var projectLink = 'https://console.developers.google.com/project',
     billingLink = 'https://console.developers.google.com/billing';

  if(localStorage.data){
    listProject(JSON.parse(localStorage.getItem("data")));
    getData();
    return false;
  }else{
    $('#loading').modal('show');
    getData(true);
  };

  function listProject(data){
    for( k in data ){
      var d = data[k],
          status = d.status,
          p_id = d.id,
          b_id = d.numericProjectId,
          name = d.name,
          assignedIdForDisplay = d.assignedIdForDisplay,
          projectURL = projectLink + '/' + p_id,
          billingURL = billingLink + '/' + b_id,
          onLineHtml,
          offLineHtml;
      if(status === 0){
         onLineHtml = '<li class="list-group-item"><ul class="list-inline"><li><h4>'+name+'</h4></li><li><a href='+projectURL
               +' target="_blank">Project <span class="glyphicon glyphicon-new-window"></span></a></li><li><a href='+billingURL
               +' target="_blank">Billing <span class="glyphicon glyphicon-new-window"></span></a></li></ul><small class="text-info">ID : '+assignedIdForDisplay+'</small></li>';
         $('#online_project_list').append(onLineHtml);
      }else{
         offLineHtml = '<li class="list-group-item"><ul class="list-inline"><li>'+name+'</li><li><a href='+projectURL
               +' target="_blank">Project <span class="glyphicon glyphicon-new-window"></span></a></li><li><a href='+billingURL
               +' target="_blank">Billing <span class="glyphicon glyphicon-new-window"></span></a></li><li class="text-danger">(Ready to delete)</li></ul><small class="text-info">ID : '+assignedIdForDisplay+'</small></li>';
         $('#offline_project_list').append(offLineHtml);
      };
    };
    $('#loading').modal('hide');
  };

  function getData(flag){
    // Connect to server
    $.ajax({
      url: 'https://console.developers.google.com/m/project',
      type: 'GET',
    }).always(function(d){
      var status = d.status;
      if(status === 200){
         // data is string.
         var data = d.responseText.replace(")]}'",'');
         // data is array
         data = _.sortBy(JSON.parse(data), function(item){return item.assignedIdForDisplay})
         localStorage.data = JSON.stringify(data);
         if(flag) listProject(data);
         return false;
      }else{
        localStorage.removeItem("data");
         // 401 error handler
         if(status === 401){
            $('#waring').removeClass('hidden').fadeIn();
            $('#loading').modal('hide');
            return false;
         };
         // Other error hendler
         $('#error').removeClass('hidden').fadeIn();
         $('#loading').modal('hide');
         return false;
      };
    })
  };
  
});
