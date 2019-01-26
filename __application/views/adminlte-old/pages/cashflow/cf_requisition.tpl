<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
	<!-- Main content -->
	<section class="content">
		<!-- /.row -->
		<div class="box box-body datagrid table-responsive no-padding"></div>
		<!-- /.box -->
	</section>
	<!-- /.content -->
</div>
<!-- /.content-wrapper -->
<script>
	var $url_module = "{$.php.base_url()~$class~'/'~$method}", $table = "{$table}", $bread = {$.php.json_encode($bread)};
	{* Toolbar Init *}
	var Toolbar_Init = {
		enable: true,
		toolbarBtn: ['btn-new','btn-copy','btn-refresh','btn-delete','btn-message','btn-print','btn-export','btn-import','btn-viewlog','btn-process'],
		disableBtn: ['btn-copy','btn-message','btn-print','btn-process'],
		hiddenBtn: ['btn-copy','btn-message'],
		processMenu: [{ id:"btn-process1", title:"Process 1" }, { id:"btn-process2", title:"Process 2" }, ],
		processMenuDisable: ['btn-process1'],
	};
	{* DataTable Init *}
	var DataTable_Init = {
		enable: true,
		tableWidth: '125%',
		act_menu: { copy: true, edit: true, delete: true },
		sub_menu: [
			{ pageid: 109, subKey: 'requisition_id', title: 'Requisition Line', },
		],
		order: ['id desc'],
		columns: [
			{ width:"100px", orderable:false, data:"org_name", title:"Org Name" },
			{ width:"100px", orderable:false, data:"orgtrx_name", title:"Org Trx Name" },
			{ width:"100px", orderable:false, data:"doc_no", title:"Doc No" },
			{ width:"50px", orderable:false, className:"dt-head-center dt-body-center", data:"doc_date", title:"Doc Date" },
			{ width:"50px", orderable:false, className:"dt-head-center dt-body-center", data:"eta_request", title:"Request ETA" },
			{ width:"50px", orderable:false, className:"dt-head-center dt-body-center", data:"eta", title:"Requisition ETA" },
			{ width:"50px", orderable:false, className:"dt-head-center dt-body-center", data:"estimation_late", title:"Diff. Request Days", 
				render: function(data, type, row){ return parseInt(data) > 0 ? data : 0; },
			},
			{ width:"50px", orderable:true, className:"dt-head-center dt-body-center", data:"eta_status", title:"Status ETA <br>(<= 6 Days)", 
				render: function(data, type, row){ 
					return $("<span>").addClass('label label-warning').text(data).prop('outerHTML');
				},
			},
			{* { width:"70px", orderable:false, className:"dt-head-center dt-body-center", data:"eta_status", title:"Status ETA <br>(<= 6 Days)", createdCell: function (td, cellData, rowData, row, col) { if ( cellData == 'Warning' ) { $(td).css({ 'background-color':'red', 'font-weight':'bold' }); } }, }, *}
			{ width:"100px", orderable:false, data:"doc_no_request", title:"Request Doc No" },
			{ width:"60px", orderable:false, className:"dt-head-center dt-body-center", data:"doc_date_request", title:"Request Doc Date" },
			{ width:"100px", orderable:false, data:"bpartner_name", title:"Customer" },
			{ width:"250px", orderable:false, data:"description", title:"Description" },
		],
	};
	
</script>
<script src="{$.const.ASSET_URL}js/window_view.js"></script>
