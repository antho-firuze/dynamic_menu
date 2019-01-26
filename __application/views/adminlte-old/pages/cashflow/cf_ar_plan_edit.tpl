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
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/inputmask.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/inputmask.numeric.extensions.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/inputmask.date.extensions.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/dependencyLibs/inputmask.dependencyLib.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/jquery.inputmask.js"></script>
{* <script src="{$.const.TEMPLATE_URL}plugins/accounting/accounting.min.js"></script> *}
<script src="{$.const.TEMPLATE_URL}plugins/moment/moment.js"></script>
<script>
	var $url_module = "{$.php.base_url()~$class~'/'~$method}", $bread = {$.php.json_encode($bread)}, $act = getURLParameter("action");
	{* For design form interface *}
	var col = [], row = [];
	var form1 = BSHelper.Form({ autocomplete:"off" });
	var box1 = BSHelper.Box({ type:"info" });
	var format_money = "'alias': 'currency', 'prefix': '', 'groupSeparator': '{$.session.group_symbol}', 'radixPoint': '{$.session.decimal_symbol}', 'digits': {$.session.number_digit_decimal}, 'negationSymbol': { 'front':'-', 'back':'' }, 'autoGroup': true, 'autoUnmask': true";
	col.push(BSHelper.Input({ horz:false, type:"number", label:"Line No", idname:"seq", required: false, value: 0, step: "1", min: "0" }));
	{* col.push(BSHelper.Input({ horz:false, type:"date", label:"SO ETD", idname:"so_etd", cls:"auto_ymd", format:"{$.session.date_format}", required: false, disabled: true })); *}
	col.push(BSHelper.Combobox({ horz:false, label:"Business Partner", label_link:"{$.const.PAGE_LNK}?pageid=87", idname:"bpartner_id", url:"{$.php.base_url('bpm/c_bpartner')}?filter=is_customer='1'", remote: true, required: true, disabled: ($act == "edt" ? true : false) }));
	col.push(BSHelper.Input({ horz:false, type:"number", label:"Business Partner TOP (Days)", idname:"so_top", style: "text-align: right;", step: "1", required: false, value: 0, placeholder: "0", readonly: true }));
	col.push(BSHelper.Input({ horz:false, type:"date", label:"Invoice Plan Date", idname:"doc_date", cls:"auto_ymd", format:"{$.session.date_format}", required: true }));
	col.push(BSHelper.Input({ horz:false, type:"date", label:"Received Plan Date", idname:"received_plan_date", cls:"auto_ymd", format:"{$.session.date_format}", required: false }));
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Note", idname:"note", required: true, }));
	row.push(subCol(6, col)); col = [];
	col.push(BSHelper.Combobox({ horz:false, label:"Account", label_link:"{$.const.PAGE_LNK}?pageid=85", textField:"code_name", idname:"account_id", url:"{$.php.base_url('cashflow/cf_account')}?filter=is_receipt='1'", remote: true, required: true }));
	col.push(BSHelper.Input({ horz:false, type:"number", label:"Sub Amount", idname:"sub_amt", style: "text-align: right;", step: ".01", min: "0", required: false, value: 0, onchange:"calculate_amount()", placeholder: "0.00" }));
	col.push(BSHelper.Input({ horz:false, type:"number", label:"VAT Amount", idname:"vat_amt", style: "text-align: right;", step: ".01", min: "0", required: false, value: 0, onchange:"calculate_amount()", placeholder: "0.00" }));
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Total Amount", idname:"ttl_amt", style: "text-align: right;", format: format_money, required: false, value: 0, readonly: true, }));
	col.push(BSHelper.Input({ horz:false, type:"textarea", label:"Description", idname:"description", }));
	row.push(subCol(6, col)); col = [];
	form1.append(subRow(row));
	form1.append(subRow(subCol()));
	col = [];
	col.push( BSHelper.Button({ type:"submit", label:"Submit", idname:"submit_btn" }) );
	col.push( '&nbsp;&nbsp;&nbsp;' );
	col.push( BSHelper.Button({ type:"button", label:"Cancel", cls:"btn-danger", idname:"btn_cancel", onclick:"window.history.back();" }) );
	form1.append( col );
	box1.find('.box-body').append(form1);
	$(".content").append(box1);

	$("[data-mask]").inputmask();
	
	{* INITILIZATION *}
	function calculate_amount(){
		$("#ttl_amt").val( parseFloat($("#sub_amt").inputmask('unmaskedvalue')) + parseFloat($("#vat_amt").inputmask('unmaskedvalue')) );
	}
	
	$("#bpartner_id").shollu_cb({
		onSelect: function(rowData){
			$("#so_top").val(rowData.so_top);
		}
	});
	
	$("#doc_date").on("change", function(){
		var dt_format = "{$.session.date_format}";
		var date_unformatted = datetime_db_format($(this).val(), dt_format);
		var so_top = $("#so_top").val();
		if ($act != 'edt')
			$("#received_plan_date").val(moment(date_unformatted).add(so_top, 'days').format(dt_format.toUpperCase())).trigger('change');
	});

	{* Only for edit mode *}
	$(document).ready(function(){
		setTimeout(function(){
			if ($act == "edt") {
				$("#bpartner_id").shollu_cb('select');
			}
		}, 2000);
	});
	
</script>
<script src="{$.const.ASSET_URL}js/window_edit.js"></script>
<script>
	{* NOTIFICATION *}
	$(document).ready(function(){
		setTimeout(function(){
			if ($act == "edt" && $data.is_posted > 0)
				box1.find('.box-body form').before(BSHelper.Callout({ type:"danger", title:"POSTED !", description:"{$.php.lang('notif_update_plan_has_posted', null, 'cashflow')}" }));
		}, 2000);
	});	
</script>
