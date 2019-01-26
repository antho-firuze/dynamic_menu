<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
	<!-- Main content -->
	<section class="content">
	</section>
	<!-- /.content -->
</div>
<!-- /.content-wrapper -->
<script src="{$.const.TEMPLATE_URL}plugins/bootstrap-validator/validator.min.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/shollu-autofill/js/shollu-autofill.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/shollu-combobox/js/shollu_cb.min.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/input-mask/jquery.inputmask.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/input-mask/jquery.inputmask.date.extensions.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/plupload/js/plupload.full.min.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/accounting/accounting.min.js"></script>
{* <script src="{$.const.TEMPLATE_URL}plugins/plupload/js/moxie.min.js"></script> *}
{* <script src="https://cdnjs.cloudflare.com/ajax/libs/plupload/3.1.0/plupload.min.js"></script> *}

<style>
#img-preview canvas{
	border-radius: 50%;
	padding: 3px;
	border: 3px solid #d2d6de;
	margin-bottom: 13px;
}
</style>
<script>
	var $url_module = "{$.php.base_url()~$class~'/'~$method}", $bread = {$.php.json_encode($bread)};
	var $id = getURLParameter("id"), $act = getURLParameter("action");
	var r_method = $.inArray($act, ['new','cpy']) > -1 ? 'POST' : 'PUT';
		
	{* For design form interface *}
	var col = [], row = [], a = [];
	var form1 = BSHelper.Form({ autocomplete:"off" });
	var form2 = BSHelper.Form({ autocomplete:"off" });
	var form3 = BSHelper.Form({ autocomplete:"off" });
	var form4 = BSHelper.Form({ autocomplete:"off" });
	var box1 = BSHelper.Box({ type:"info", header:false, toolbtn:['min','rem'] });
	
	col.push( $('<div style="text-align:center;width:100%;" />') );
	col.push( $('<div id="img-preview" style="text-align:center;width:100%;" />') );
	col.push( $('<img class="profile-user-img img-responsive img-circle" src="{$.php.base_url()}upload/images/default-photo.png" style="width:150px; height:150px; margin-bottom:13px;" alt="Picture" />') );
	{* col.push( $('<h3 class="profile-username text-center">{$.session.user_name}</h3>') );  *}
	{* col.push( $('<p class="text-muted text-center">{$.session.user_description}</p>') );  *}
	col.push( $('<ul class="list-group list-group-unbordered" />')
		.append( $('<li class="list-group-item" />').append( $('<b>Leave Balance</b><a class="leave-balance pull-right">0 Days</a>') ))
		.append( $('<li class="list-group-item" />').append( $('<b>Profile Status</b><a class="profile-status pull-right">0%</a>') ))
  );
	col.push( BSHelper.Button({ type:"button", label:"Insert Picture", idname:"btn_uploadphoto", style:"width:100%;" }) ); 
	form1.append(subRow(subCol(12, col)));
	box1.find('.box-body').append(subRow(subCol(12, col)));
	
	var tab1 = BSHelper.Tabs({
		dataList: [
			{	title:"Personal", idname:"tab-personal", 
				content:function(){
					col = [], row = [], a = [];
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Code", idname:"code", required: false, }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"First Name", idname:"first_name", required: true, }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Last Name", idname:"last_name", required: true, }));
					col.push(BSHelper.Input({ horz:false, type:"textarea", label:"Description", idname:"description", }));
					row.push(subCol(6, col)); col = [];
					col.push(BSHelper.Checkbox({ horz:false, label:"Is Active", idname:"is_active", value:1 }));
					col.push(BSHelper.Input({ type:"text", label:"Birth Place", idname:"birth_place", required: false }));
					col.push(BSHelper.Input({ type:"date", label:"Birth Date", idname:"birth_date", cls:"auto_ymd", format:"{$.session.date_format}" }));
					row.push(subCol(6, col)); col = [];
					a.push(subRow(row)); col = []; row = [];
					col.push(BSHelper.Combobox({ horz:false, label:"Gender", label_link:"{$.const.PAGE_LNK}?pageid=62", idname:"gender_id", url:"{$.php.base_url('hrm/hr_gender')}", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Religion", label_link:"{$.const.PAGE_LNK}?pageid=71", idname:"religion_id", url:"{$.php.base_url('hrm/hr_religion')}", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Marital Status", label_link:"{$.const.PAGE_LNK}?pageid=66", idname:"marital_status_id", url:"{$.php.base_url('hrm/hr_marital_status')}", remote: true }));
					row.push(subCol(6, col)); col = [];
					col.push(BSHelper.Combobox({ horz:false, label:"Education Level", label_link:"{$.const.PAGE_LNK}?pageid=55", idname:"education_level_id", url:"{$.php.base_url('hrm/hr_education')}", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Home Status", label_link:"{$.const.PAGE_LNK}?pageid=63", idname:"home_status_id", url:"{$.php.base_url('hrm/hr_home_status')}", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Nationality", label_link:"{$.const.PAGE_LNK}?pageid=69", idname:"nationality_id", url:"{$.php.base_url('hrm/hr_nationality')}", remote: true }));
					row.push(subCol(6, col)); col = [];
					a.push(subRow(row)); col = []; row = [];
					return a;
				} 
			},
			{	title:"Contact", idname:"tab-contact", 
				content:function(){
					col = [], row = [], a = [];
					col.push(BSHelper.Input({ type:"text", label:"Email", idname:"email", required: false }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Phone", idname:"phone", required: false, }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Fax", idname:"fax", required: false, }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Website", idname:"website", required: false, }));
					row.push(subCol(6, col)); col = [];
					row.push(subCol(6, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Employment", idname:"tab-employment", 
				content:function(){
					col = [], row = [], a = [];
					col.push(BSHelper.Combobox({ horz:false, label:"Company", label_link:"{$.const.PAGE_LNK}?pageid=18", idname:"company_id", textField:"code_name", url:"{$.php.base_url('systems/a_org_list')}", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Location", label_link:"{$.const.PAGE_LNK}?pageid=18", idname:"branch_id", textField:"code_name", url:"{$.php.base_url('systems/a_orgtrx_list')}?filter=parent_id=0", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Department", label_link:"{$.const.PAGE_LNK}?pageid=18", idname:"department_id", textField:"code_name", url:"{$.php.base_url('systems/a_orgdept_list')}?filter=parent_id=0", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Division", label_link:"{$.const.PAGE_LNK}?pageid=18", idname:"division_id", textField:"code_name", url:"{$.php.base_url('systems/a_orgdiv_list')}?filter=parent_id=0", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Job Title", label_link:"{$.const.PAGE_LNK}?pageid=64", idname:"job_title_id", url:"{$.php.base_url('hrm/hr_job_title')}", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Occupation", label_link:"{$.const.PAGE_LNK}?pageid=70", idname:"occupation_id", url:"{$.php.base_url('hrm/hr_occupation')}", remote: true }));
					row.push(subCol(6, col)); col = [];
					col.push(BSHelper.Combobox({ horz:false, label:"Employee Status", label_link:"{$.const.PAGE_LNK}?pageid=57", idname:"employee_status_id", url:"{$.php.base_url('hrm/hr_employee_status')}", remote: true }));
					col.push(BSHelper.Combobox({ horz:false, label:"Employee Level", label_link:"{$.const.PAGE_LNK}?pageid=57", idname:"employee_level_id", url:"{$.php.base_url('hrm/hr_employee_level')}", remote: true }));
					col.push(BSHelper.Input({ type:"text", label:"Employee ID/NIK", idname:"employee_id", required: false }));
					col.push(BSHelper.Input({ horz:false, type:"date", label:"Begin Date", idname:"begin_date", cls:"auto_ymd", format:"{$.session.date_format}" }));
					col.push(BSHelper.Input({ horz:false, type:"date", label:"End Date", idname:"end_date", cls:"auto_ymd", format:"{$.session.date_format}" }));
					col.push(BSHelper.Input({ type:"text", label:"BPJS TK No", idname:"bpjs_tk_no", required: false }));
					col.push(BSHelper.Input({ type:"text", label:"BPJS KES No", idname:"bpjs_kes_no", required: false }));
					row.push(subCol(6, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Finance & Taxes", idname:"tab-finance", 
				content:function(){
					col = [], row = [], a = [];
					col.push(BSHelper.Combobox({ horz:false, label:"Bank", label_link:"{$.const.PAGE_LNK}?pageid=20", idname:"bank_id", url:"{$.php.base_url('hrm/fa_bank')}", remote: true }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Account No", idname:"bank_account_no", required: false, }));
					row.push(subCol(6, col)); col = [];
					col.push(BSHelper.Input({ horz:false, type:"text", label:"NPWP No", idname:"npwp_no", required: false, }));
					col.push(BSHelper.Input({ horz:false, type:"date", label:"NPWP Date", idname:"npwp_date", cls:"auto_ymd", format:"{$.session.date_format}" }));
					col.push(BSHelper.Input({ horz:false, type:"textarea", label:"NPWP Address", idname:"npwp_address", }));
					row.push(subCol(6, col)); col = [];
					a.push(subRow(row)); col = []; row = [];
					row.push(subCol(6, col)); col = [];
					row.push(subCol(6, col)); col = [];
					a.push(subRow(row)); col = []; row = [];
					return a;
				} 
			},
			{	title:"Others", idname:"tab-other", 
				content:function(){
					col = [], row = [], a = [];
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Father Name", idname:"father_name", required: false, }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Mother Name", idname:"mother_name", required: false, }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Spouse Name", idname:"spouse_name", required: false, }));
					row.push(subCol(6, col)); col = [];
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Child Name 1", idname:"child1_name", required: false, }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Child Name 2", idname:"child2_name", required: false, }));
					col.push(BSHelper.Input({ horz:false, type:"text", label:"Child Name 3", idname:"child3_name", required: false, }));
					row.push(subCol(6, col)); col = [];
					a.push(subRow(row)); col = []; row = [];
					row.push(subCol(6, col)); col = [];
					row.push(subCol(6, col)); col = [];
					a.push(subRow(row)); col = []; row = [];
					return a;
				} 
			},
		],
	});
	
	var tab2 = BSHelper.Tabs({
		dataList: [
			{	title:"Allowance", idname:"tab-allowance", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Card", idname:"tab-card", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Education", idname:"tab-education", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Employee History", idname:"tab-employee-history", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Experience", idname:"tab-experience", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Facility", idname:"tab-facility", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Leave", idname:"tab-leave", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Loan", idname:"tab-loan", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Training", idname:"tab-training", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Travel", idname:"tab-travel", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
			{	title:"Sosial", idname:"tab-sosial", 
				content:function(){
					col = [], row = [], a = [];
					row.push(subCol(12, col)); col = [];
					return subRow(row);
				} 
			},
		],
	});
	
	col = []; row = []; a = [];
	col.push(subCol(3, box1));
	
	a.push( tab1 );
	a.push( BSHelper.Button({ type:"submit", label:"Submit", cls:"btn-primary", style:"margin-top:-10px; margin-bottom:10px;" }) );
	a.push( '&nbsp;&nbsp;&nbsp;' );
	a.push( BSHelper.Button({ type:"button", label:"Cancel", cls:"btn-danger", style:"margin-top:-10px; margin-bottom:10px;", idname:"btn_cancel", onclick:"window.history.back();" }) );
	
	col.push(subCol(9, a)); 
	form1.append(col);
	
	row.push(subRow(form1)); col = [];
	col.push(subCol(12, tab2));
	row.push(subRow(col)); col = [];
	$(".content").append(row);
	
	$("[data-mask]").inputmask();
	
	{* INITILIZATION *}
	$("#company_id").shollu_cb({ 
		onSelect: function(rowData){
			var id = $("#company_id").shollu_cb('getValue', 'id');
			$("#branch_id")
				.shollu_cb({ queryParams: { "filter":"parent_id="+id }})
				.shollu_cb('setValue', '');
			$("#department_id").shollu_cb('setValue', '');
			$("#division_id").shollu_cb('setValue', '');
		}
	});
	
	$("#branch_id").shollu_cb({ 
		onSelect: function(rowData){
			var id = $("#branch_id").shollu_cb('getValue', 'id');
			$("#department_id")
				.shollu_cb({ queryParams: { "filter":"parent_id="+id }})
				.shollu_cb('setValue', '');
			$("#division_id").shollu_cb('setValue', '');
		}
	});
	
	$("#department_id").shollu_cb({ 
		onSelect: function(rowData){
			var id = $("#department_id").shollu_cb('getValue', 'id');
			$("#division_id")
				.shollu_cb({ queryParams: { "filter":"parent_id="+id }})
				.shollu_cb('setValue', '');
		}
	});
	
	{* Init data for custom element (combogrid, button etc.) *}
	var uploader = new plupload.Uploader({ url: $url_module, runtimes:"html5",
		filters: { max_file_size: "2mb", mime_types: [{ title:"Image files", extensions:"jpg,gif,png" }] },
		browse_button: "btn_uploadphoto", 
		multi_selection: false, 
		multipart_params: { "userphoto":1, "id": $id },
		init: {
			FilesAdded: function(up, files) {
				{* uploader.start(); *}
				console.log(up.files.length);
				
				{* up.setOption('http_method', r_method); *}
				
				if(uploader.files.length > 1)
				{
					$('#img-preview canvas')[0].remove();
					uploader.removeFile(uploader.files[0]);
					uploader.refresh();
				} else {
					$('.profile-user-img').hide();
				}
				plupload.each(files, function(file) {
					var img = new mOxie.Image();
					img.onload = function() {
						this.embed($('#img-preview').get(0), {
								width: 150,
								height: 150,
								crop: false
						}).unbind( "click" );
					};
					img.load(file.getSource());
				});
			},
			FileUploaded: function(up, file, info) {
				var response = $.parseJSON(info.response);
				BootstrapDialog.alert(response.message, function(){
					window.history.back();
				});
				{* console.log(response.file_url); *}
				{* if (response.status) {  *}
					{* $('img.profile-user-img').attr('src', response.data_uri); *}
					{* $('#photo_file').val(response.photo_file); *}
				{* } *}
			},
			Error: function(up, err) {
				console.log(err);
				var msg = '';
				if (err.code == -600 )
					msg = 'Error: Maximal file size is '+up.settings.filters.max_file_size;
				BootstrapDialog.alert({ type:'modal-danger', title:'Notification', message:msg });
			}
		}
	});
	uploader.bind('BeforeUpload', function(uploader, file) {
		uploader.settings.multipart_params = { "userphoto":1, "id": $id };
	});
	uploader.init();
	
	{* $.getJSON($url_module + '_photo', { "personnel_id": ($id==null)?-1:$id }, function(result){  *}
	$.getJSON($url_module, { "id": ($id==null)?-1:$id }, function(result){ 
		if (!isempty_obj(result.data.rows)) {
			var photo_file = result.data.rows[0].photo_file;
			if (photo_file) {
				{* console.log(result.data.rows[0].photo_binx); *}
				{* $('img.profile-user-img').attr('src', result.data.rows[0].photo_binx); *}
				$("img.profile-user-img").attr("src", "{$.const.BASE_URL~$.session.personnel_photo_path}"+photo_file);
			}
			$(".profile-status").text(accounting.toFixed(result.data.rows[0].profile_status, 2)+'%');
		}
	});

	form1.validator().on('submit', function(e) {
		if (e.isDefaultPrevented()) { return false;	} 
		
		{* adding primary key id on the fly *}
		form1.append(BSHelper.Input({ type:"hidden", idname:"id", value:$id }));
		
		form1.find("[type='submit']").prop( "disabled", true );
		
		$.ajax({ url: $url_module, method: r_method, async: true, dataType:'json',
			data: form1.serializeJSON(),
			success: function(data) {
				if (r_method == 'POST') {
					console.log(data.id);
					$id = data.id;
				}
				if (uploader.files.length > 0) {
					uploader.start();
				} else {
					BootstrapDialog.alert(data.message, function(){
						window.history.back();
					});
				}
			},
			error: function(data) {
				if (data.status==500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				form1.find("[type='submit']").prop( "disabled", false );
				BootstrapDialog.alert({ type:'modal-danger', title:'Notification', message:message });
			}
		});

		return false;
	});

</script>
<script src="{$.const.ASSET_URL}js/window_edit.js"></script>
