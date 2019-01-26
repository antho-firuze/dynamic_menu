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
	col.push(BSHelper.Input({ horz:false, type:"date", label:"SO ETD", idname:"so_etd", cls:"auto_ymd", format:"{$.session.date_format}", required: false, disabled: true }));
	col.push(BSHelper.Input({ horz:false, type:"date", label:"Invoice Plan Date", idname:"doc_date", cls:"auto_ymd", format:"{$.session.date_format}", required: true }));
	col.push(BSHelper.Input({ horz:false, type:"number", label:"Customer TOP (Days)", idname:"so_top", style: "text-align: right;", step: ".01", required: false, value: 0, placeholder: "0", readonly: true }));
	col.push(BSHelper.Input({ horz:false, type:"date", label:"Received Plan Date", idname:"received_plan_date", cls:"auto_ymd", format:"{$.session.date_format}", required: false }));
	col.push(BSHelper.Combobox({ label:"Type", idname:"note", required: true, value: 0, disabled: ($act=='edt'?true:false), 
		list:[
			{ id:"DP", name:"Down Payment" },
			{ id:"Approval Drawing", name:"Approval Drawing" },
			{ id:"Material Receipt", name:"Material Receipt" },
			{ id:"Progress", name:"Progress" },
			{ id:"Inspector", name:"Inspector" },
			{ id:"Shipment", name:"Shipment" },
			{ id:"Complete", name:"Complete" },
		] 
	}));
	col.push(BSHelper.Input({ horz:false, type:"number", label:"Amount", idname:"amount", style: "text-align: right;", step: ".01", required: false, value: 0, placeholder: "0.00" }));
	col.push(BSHelper.Input({ horz:false, type:"textarea", label:"Description", idname:"description", }));
	row.push(subCol(6, col)); col = [];
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
	
	var $filter = getURLParameter("filter");
	if ($filter.split('=')[0] == 'order_id'){
		var order_id = $filter.split('=')[1];
		$.getJSON($url_module, { "get_custom_field": 1, "order_id": order_id }, function(result){ 
			if (!isempty_obj(result.data)){
				$("#so_etd").val(result.data.etd);
				$("#so_top").val(result.data.so_top);
				$("#amount").val(result.data.amount);
			} 
		});
	}
	
	$("#doc_date").on("change", function(){
		var dt_format = "{$.session.date_format}";
		var date_unformatted = datetime_db_format($(this).val(), dt_format);
		var so_top = $("#so_top").val();
		if ($act != 'edt')
			$("#received_plan_date").val(moment(date_unformatted).add(so_top, 'days').format(dt_format.toUpperCase())).trigger('change');
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
