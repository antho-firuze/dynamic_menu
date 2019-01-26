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
<script src="{$.const.TEMPLATE_URL}plugins/accounting/accounting.min.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/datatables/extensions/FixedColumns/js/dataTables.fixedColumns.min.js"></script>
<script>
	var $url_module = "{$.php.base_url()~$class~'/'~$method}", $table = "{$table}", $bread = {$.php.json_encode($bread)};
	{* Toolbar Init *}
	var Toolbar_Init = {
		enable: false,
		toolbarBtn: ['btn-new','btn-copy','btn-refresh','btn-delete','btn-message','btn-print','btn-export','btn-import','btn-viewlog','btn-process'],
		disableBtn: ['btn-copy','btn-message','btn-print','btn-process'],
		hiddenBtn: ['btn-copy','btn-message'],
		processMenu: [{ id:"btn-process1", title:"Process 1" }, { id:"btn-process2", title:"Process 2" }, ],
		processMenuDisable: ['btn-process1'],
	};
	{* DataTable Init *}
	var format_money = function(money){ return accounting.formatMoney(money, '', {$.session.number_digit_decimal}, "{$.session.group_symbol}", "{$.session.decimal_symbol}") };
	var DataTable_Init = {
		enable: true,
		rows: 100,
		showFilter: false,
		showPaginate: false,
		showColumnMenu: false,
		tableWidth: '200%',
		act_menu: { copy: true, edit: true, delete: true },
		sub_menu: [],
		fixedColumns: {
			leftColumns: 1,
		},
		order: ['seq asc'],
		columns: [
			{ width:"200px", orderable:false, data:"description", title:"Description", render: function(data, type, row){ return (row.type == 'T' || row.type == 'L') ? '<b>'+data+'</b>' : data; } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"prev_90_after", title:"< 90 <br>Outstanding", render: function(data, type, row){ return (row.type == 'T' || row.type == 'C') ? '' : (row.account_id) ? '<a target="_blank" href="'+$BASE_URL+'systems/x_page?pageid=232&filter='+row.prev_90_after_param+'&title='+row.prev_90_after_title+'">'+format_money(data)+'</a>' : format_money(data); } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"prev_90", title:"60-90 <br>Outstanding", render: function(data, type, row){ return (row.type == 'T' || row.type == 'C') ? '' : (row.account_id) ? '<a target="_blank" href="'+$BASE_URL+'systems/x_page?pageid=232&filter='+row.prev_90_param+'&title='+row.prev_90_title+'">'+format_money(data)+'</a>' : format_money(data); } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"prev_60", title:"30-60 <br>Outstanding", render: function(data, type, row){ return (row.type == 'T' || row.type == 'C') ? '' : (row.account_id) ? '<a target="_blank" href="'+$BASE_URL+'systems/x_page?pageid=232&filter='+row.prev_60_param+'&title='+row.prev_60_title+'">'+format_money(data)+'</a>' : format_money(data); } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"prev_30", title:"1-30 <br>Outstanding", render: function(data, type, row){ return (row.type == 'T' || row.type == 'C') ? '' : (row.account_id) ? '<a target="_blank" href="'+$BASE_URL+'systems/x_page?pageid=232&filter='+row.prev_30_param+'&title='+row.prev_30_title+'">'+format_money(data)+'</a>' : format_money(data); } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"total_outstanding", title:"Total <br>Outstanding", render: function(data, type, row){ return (row.type == 'T' || row.type == 'C') ? '' : '<span title="'+row.description+'">'+format_money(data)+'</span>'; } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"total_projection", title:"Total <br>Projection", render: function(data, type, row){ return (row.type == 'T' || row.type == 'C') ? '' : '<span title="'+row.description+'">'+format_money(data)+'</span>'; } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"grand_total", title:"Grand Total", render: function(data, type, row){ return (row.type == 'T' || row.type == 'C') ? '' : '<span title="'+row.description+'">'+format_money(data)+'</span>'; } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"current", title:"Current Date <br>Projection", render: function(data, type, row){ return (row.type == 'T') ? '' : (row.account_id) ? '<a target="_blank" href="'+$BASE_URL+'systems/x_page?pageid=232&filter='+row.today_param+'&title='+row.today_title+'">'+format_money(data)+'</a>' : format_money(data); } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"next_30", title:"1-30 <br>Projection", render: function(data, type, row){ return (row.type == 'T') ? '' : (row.account_id) ? '<a target="_blank" href="'+$BASE_URL+'systems/x_page?pageid=232&filter='+row.next_30_param+'&title='+row.next_30_title+'">'+format_money(data)+'</a>' : format_money(data); } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"next_60", title:"30-60 <br>Projection", render: function(data, type, row){ return (row.type == 'T') ? '' : (row.account_id) ? '<a target="_blank" href="'+$BASE_URL+'systems/x_page?pageid=232&filter='+row.next_60_param+'&title='+row.next_60_title+'">'+format_money(data)+'</a>' : format_money(data); } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"next_90", title:"60-90 <br>Projection", render: function(data, type, row){ return (row.type == 'T') ? '' : (row.account_id) ? '<a target="_blank" href="'+$BASE_URL+'systems/x_page?pageid=232&filter='+row.next_90_param+'&title='+row.next_90_title+'">'+format_money(data)+'</a>' : format_money(data); } },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"next_90_after", title:"> 90 <br>Projection", render: function(data, type, row){ return (row.type == 'T') ? '' : (row.account_id) ? '<a target="_blank" href="'+$BASE_URL+'systems/x_page?pageid=232&filter='+row.next_90_after_param+'&title='+row.next_90_after_title+'">'+format_money(data)+'</a>' : format_money(data); } },
		],
	};
	
	{* INITILIZATION *}
	setTimeout(function(){
		var $filter = dateFormat(dateParsing(getURLParameter("filter").split('=')[1], "yyyy-mm-dd"), "dd/mm/yyyy");
		$(".content-header").find("h1").text($(".content-header").find("h1").text()+" as per "+$filter);
	}, 500);
	
</script>
<script src="{$.const.ASSET_URL}js/window_view.js"></script>
