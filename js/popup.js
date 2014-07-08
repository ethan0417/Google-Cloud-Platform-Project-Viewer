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
          projectURL = projectLink + '/' + p_id,
          billingURL = billingLink + '/' + b_id,
          onLineHtml,
          offLineHtml;
      if(status === 0){
         onLineHtml = '<li class="list-group-item"><ul class="list-inline"><li>'+name+'</li><li><a href='+projectURL
               +' target="_blank">Project</a></li><li><a href='+billingURL
               +' target="_blank">Billing</a></li></ul></li>';
         $('#online_project_list').append(onLineHtml);
      }else{
         offLineHtml = '<li class="list-group-item"><ul class="list-inline"><li>'+name+'</li><li><a href='+projectURL
               +' target="_blank">Project</a></li><li><a href='+billingURL
               +' target="_blank">Billing</a></li><li class="text-danger">(Ready to delete)</li></ul></li>';
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
         var data = d.responseText.replace(")]}'",'');
         localStorage.data = data;
         if(flag) listProject(JSON.parse(data));
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
