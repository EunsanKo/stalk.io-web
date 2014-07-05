$(function(){
	$('#newUrl').click(function(){
        $('#myModal').modal('show');
    });
    
    
})

function gotoChat(id){
    location.href = '/chat/'+id;
}


function deleteStalkUser(stalkId){
    console.log('delete : ',stalkId);
	$('#deleteId').val(stalkId);
	
	if(confirm("Are you sure?")){
		$("#delForm").submit();
	}
}


            