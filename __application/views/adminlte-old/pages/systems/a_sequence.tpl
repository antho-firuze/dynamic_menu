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
		disableBtn: ['btn-copy','btn-message','btn-process'],
		hiddenBtn: ['btn-copy','btn-message'],
		processMenu: [{ id:"btn-process1", title:"Process 1" }, { id:"btn-process2", title:"Process 2" }, ],
		processMenuDisable: ['btn-process1'],
	};
	if ("{$is_canimport}" == "0") Toolbar_Init.disableBtn.push('btn-import');
	if ("{$is_canexport}" == "0") Toolbar_Init.disableBtn.push('btn-export');
	{* DataTable Init *}
	var DataTable_Init = {
		enable: true,
		act_menu: { copy: true, edit: true, delete: true },
		sub_menu: [],
		columns: [
			{ width:"130px", orderable:false, data:"code_name", title:"Name" },
			{ width:"250px", orderable:false, data:"description", title:"Description" },
			{ width:"40px", orderable:false, className:"dt-head-center dt-body-center", data:"is_active", title:"Active", render:function(data, type, row){ return (data=='1') ? 'Y' : 'N'; } },
			{ width:"50px", orderable:false, data:"start_no", title:"Start No" },
			{ width:"50px", orderable:false, data:"digit_no", title:"Digit No" },
			{ width:"50px", orderable:false, data:"prefix", title:"Prefix" },
			{ width:"50px", orderable:false, data:"suffix", title:"Suffix" },
			{ width:"50px", orderable:false, data:"revision_code", title:"Revision Code" },
			{ width:"40px", orderable:false, className:"dt-head-center dt-body-center", data:"startnewyear", title:"Start New Year", render:function(data, type, row){ return (data=='1') ? 'Y' : 'N'; } },
			{ width:"40px", orderable:false, className:"dt-head-center dt-body-center", data:"startnewmonth", title:"Start New Month", render:function(data, type, row){ return (data=='1') ? 'Y' : 'N'; } },
		],
	};
	
</script>
<script src="{$.const.ASSET_URL}js/window_view.js"></script>
