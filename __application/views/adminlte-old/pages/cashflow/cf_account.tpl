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
<style>
td.details-control {
    background: url("https://raw.githubusercontent.com/DataTables/DataTables/1.10.7/examples/resources/details_open.png") no-repeat center center;
    cursor: pointer;
}
tr.shown td.details-control {
    background: url("https://raw.githubusercontent.com/DataTables/DataTables/1.10.7/examples/resources/details_close.png") no-repeat center center;
}
</style>
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
		treeView: true,
		act_menu: { copy: true, edit: true, delete: true },
		sub_menu: [],
		columns: [
			{ width:"130px", orderable:false, data:"code_name", title:"Name" },
			{ width:"250px", orderable:false, data:"description", title:"Description" },
			{ width:"40px", orderable:false, className:"dt-head-center dt-body-center", data:"is_active", title:"Active", render:function(data, type, row){ return (data=='1') ? 'Y' : 'N'; } },
			{ width:"40px", orderable:false, className:"dt-head-center dt-body-center", data:"is_sotrx", title:"Is Inflow", render:function(data, type, row){ return (data=='1') ? 'Y' : 'N'; } },
		],
	};
	
</script>
<script src="{$.const.ASSET_URL}js/window_treeview.js"></script>
