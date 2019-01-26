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
<link rel="stylesheet" href="{$.const.TEMPLATE_URL}plugins/jQuery-QueryBuilder/css/query-builder.default.min.css">
<link rel="stylesheet" href="{$.const.TEMPLATE_URL}plugins/datepicker/datepicker3.css">
<script src="{$.const.TEMPLATE_URL}plugins/jQuery-QueryBuilder/js/query-builder.standalone.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/interact/dist/interact.min.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/bootbox/bootbox.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/sql-parser/browser/sql-parser.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/daterangepicker/moment.min.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/datepicker/bootstrap-datepicker.js"></script>

<script src="{$.const.TEMPLATE_URL}plugins/accounting/accounting.min.js"></script>
<script>
	var $url_module = "{$.php.base_url()~$class~'/'~$method}", $table = "{$table}", $bread = {$.php.json_encode($bread)};
	{* Toolbar Init *}
	var Toolbar_Init = {
		enable: true,
		toolbarBtn: ['btn-new','btn-copy','btn-refresh','btn-delete','btn-message','btn-print','btn-export','btn-import','btn-viewlog','btn-process','btn-filter','btn-sort'],
		disableBtn: ['btn-copy','btn-message','btn-print','btn-process'],
		hiddenBtn: ['btn-copy','btn-message'],
		processMenu: [{ id:"btn-process1", title:"Process 1" }, { id:"btn-process2", title:"Process 2" }, ],
		processMenuDisable: ['btn-process1'],
	};
	if ("{$is_canimport}" == "0") Toolbar_Init.disableBtn.push('btn-import');
	if ("{$is_canexport}" == "0") Toolbar_Init.disableBtn.push('btn-export');
	{* DataTable Init *}
	var format_money = function(money){ return accounting.formatMoney(money, '', {$.session.number_digit_decimal}, "{$.session.group_symbol}", "{$.session.decimal_symbol}") };
	var DataTable_Init = {
		enable: true,
		tableWidth: '200%',
		act_menu: { copy: true, edit: true, delete: true },
		sub_menu: [
			{ pageid: 110, subKey: 'order_id', title: 'Purchase Order Line', },
			{ pageid: 111, subKey: 'order_id', title: 'Purchase Order Plan' },
			{ pageid: 112, subKey: 'order_id', title: 'Purchase Order Plan Clearance' },
			{ pageid: 113, subKey: 'order_id', title: 'Purchase Order Plan Custom Duty' },
		],
		order: ['id desc'],
		columns: [
			{ width:"100px", orderable:true, data:"org_name", title:"Org Name" },
			{ width:"100px", orderable:true, data:"orgtrx_name", title:"Org Trx Name" },
			{ width:"150px", orderable:true, data:"bpartner_name", title:"Vendor" },
			{ width:"100px", orderable:true, data:"doc_no", title:"Doc No" },
			{ width:"60px", orderable:true, className:"dt-head-center dt-body-center", data:"doc_date", title:"Doc Date" },
			{ width:"40px", orderable:true, className:"dt-head-center dt-body-center", data:"is_import", title:"Import", render:function(data, type, row){ return (data=='1') ? 'Y' : 'N'; } },
			{ width:"60px", orderable:true, className:"dt-head-center dt-body-center", data:"eta", title:"ETA" },
			{ width:"100px", orderable:true, data:"doc_no_requisition", title:"PR Doc No" },
			{ width:"50px", orderable:true, className:"dt-head-center dt-body-center", data:"doc_date_requisition", title:"PR Doc Date" },
			{ width:"50px", orderable:true, className:"dt-head-center dt-body-center", data:"eta_requisition", title:"PR ETA" },
			{ width:"200px", orderable:true, data:"description", title:"Description" },
			{ width:"100px", orderable:true, className:"dt-head-center dt-body-right", data:"sub_total", title:"Sub Total", render: function(data, type, row){ return format_money(data); } },
			{ width:"100px", orderable:true, className:"dt-head-center dt-body-right", data:"vat_total", title:"VAT Total", render: function(data, type, row){ return format_money(data); } },
			{ width:"100px", orderable:true, className:"dt-head-center dt-body-right", data:"grand_total", title:"Grand Total", render: function(data, type, row){ return format_money(data); } },
			{ width:"100px", orderable:true, className:"dt-head-center dt-body-right", data:"plan_total", title:"Plan Total", render: function(data, type, row){ return format_money(data); } },
			{ width:"100px", orderable:true, className:"dt-head-center dt-body-right", data:"plan_cl_total", title:"Plan Total (CL)", render: function(data, type, row){ return format_money(data); } },
			{ width:"100px", orderable:true, className:"dt-head-center dt-body-right", data:"plan_im_total", title:"Plan Total (IM)", render: function(data, type, row){ return format_money(data); } },
		],
	};

	var Filter_Fields = [
		{
			unique: true,
			id: 'is_import',
			label: 'Is Import',
			type: 'string',
			input: 'radio',
			values: {	'1': 'Yes',	'0': 'No'	},
			operators: ['equal'],
		},{
			unique: true,
			id: 'grand_total',
			label: 'Grand Total',
			type: 'double',
			size: 5,
			validation: {	min: 0,	step: 0.01 },
		},{
			unique: true,
			id: 't1.doc_date',
			label: 'Doc Date',
			type: 'datetime',
			plugin: 'datepicker',
			plugin_config: { format: "yyyy-mm-dd", todayBtn: 'linked', todayHighlight: true, autoclose: true },
			input_event: 'dp.change',
			description: 'Format date yyyy-mm-dd. Ex: 2017-11-22',
		},
	];
	
	{* Initialization *}
	
</script>
<script src="{$.const.ASSET_URL}js/window_view.js"></script>
