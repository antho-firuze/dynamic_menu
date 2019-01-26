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
<script src="{$.const.TEMPLATE_URL}plugins/shollu-autofill/js/shollu-autofill.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/inputmask.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/inputmask.numeric.extensions.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/jquery.inputmask.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/accounting/accounting.min.js"></script>
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
	if ("{$is_canimport}" == "0") Toolbar_Init.disableBtn.push('btn-import');
	if ("{$is_canexport}" == "0") Toolbar_Init.disableBtn.push('btn-export');
	{* DataTable Init *}
	var format_money = function(money){ return accounting.formatMoney(money, '', {$.session.number_digit_decimal}, "{$.session.group_symbol}", "{$.session.decimal_symbol}") };
	var DataTable_Init = {
		enable: true,
		tableWidth: '125%',
		act_menu: { copy: true, edit: true, delete: true },
		sub_menu: [
			{* { pageid: 99, subKey: 'order_id', title: 'Order Line', }, *}
			{* { pageid: 100, subKey: 'order_id', title: 'Order Plan' }, *}
		],
		columns: [
			{ width:"100px", orderable:false, data:"doc_no", title:"Doc No" },
			{ width:"25px", orderable:false, data:"seq", title:"Line" },
			{* { width:"100px", orderable:false, data:"doc_type", title:"Doc Type", render: function(data, type, row){ return (data == '2') ? 'Invoice Vendor' : 'Other Payment'; } }, *}
			{ width:"100px", orderable:false, data:"invoice_no", title:"Invoice No" },
			{ width:"50px", orderable:false, className:"dt-head-center dt-body-center", data:"invoice_date", title:"Invoice Date" },
			{ width:"150px", orderable:false, data:"account_name", title:"Account" },
			{ width:"250px", orderable:false, data:"note", title:"Note" },
			{ width:"100px", orderable:false, className:"dt-head-center dt-body-right", data:"amount", title:"Amount", render: function(data, type, row){ return format_money(data); } },
			{ width:"250px", orderable:false, data:"description", title:"Description" },
		],
		order: ['seq'],
	};
	
	{* For design form interface *}
	var $filter = getURLParameter("filter");
	var col = [], row = [];
	var form1 = BSHelper.Form({ autocomplete:"off" });
	var box1 = BSHelper.Box({ type:"info", footer: false });
	var format_money_2 = "'alias': 'decimal', 'prefix': '', 'groupSeparator': '{$.session.group_symbol}', 'radixPoint': '{$.session.decimal_symbol}', 'digits': {$.session.number_digit_decimal}, 'negationSymbol': { 'front':'-', 'back':'' }, 'rightAlign': true, 'autoGroup': true, 'autoUnmask': true";
	col.push(BSHelper.Input({ horz:true, type:"text", label:"Grand Total", idname:"grand_total", style: "text-align: right;", format: format_money_2, required: false, value: 0, readonly: true, placeholder: "0", }));
	row.push(subCol(12, col)); col = [];
	{* row.push(subCol(6, col)); col = []; *}
	form1.append(subRow(row)); row = [];
	box1.find('.box-body').append(form1);
	row.push(subCol(7));
	row.push(subCol(5, box1));
	$(".content").append(subRow(row));
	{* console.log($filter.split('=')[0]); *}
	
	$("[data-mask]").inputmask();
	
	if ($filter.split('=')[0] == 'cashbank_id'){
		var cashbank_id = $filter.split('=')[1];
		$.getJSON($url_module, { "summary": 1, "cashbank_id": cashbank_id }, function(result){ 
			if (!isempty_obj(result.data)) 
				form1.shollu_autofill('load', result.data);  
		});
	}
</script>
<script src="{$.const.ASSET_URL}js/window_view.js"></script>
