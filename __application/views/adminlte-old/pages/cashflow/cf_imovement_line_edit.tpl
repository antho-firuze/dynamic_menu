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
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/jquery.inputmask.js"></script>
<script>
	var $url_module = "{$.php.base_url()~$class~'/'~$method}", $bread = {$.php.json_encode($bread)}, $act = getURLParameter("action");
	{* For design form interface *}
	var col = [], row = [];
	var form1 = BSHelper.Form({ autocomplete:"off" });
	var box1 = BSHelper.Box({ type:"info" });
	var format_money = "'alias': 'currency', 'prefix': '', 'groupSeparator': '{$.session.group_symbol}', 'radixPoint': '{$.session.decimal_symbol}', 'digits': {$.session.number_digit_decimal}, 'negationSymbol': { 'front':'-', 'back':'' }, 'autoGroup': true, 'autoUnmask': true";
	col.push(BSHelper.Input({ horz:false, type:"number", label:"Line No", idname:"seq", required: false, value: 0, step: "1", min: "0" }));
	col.push(BSHelper.Combobox({ horz:false, label:"Request Line", textField:"list_name", idname:"request_line_id", url:"{$.php.base_url('cashflow/cf_request_line')}?for_outbound=1&act="+$act, remote: true, required: true, disabled: ($act=='edt'?true:false), }));
	col.push(BSHelper.Combobox({ horz:false, label:"Item Category", label_link:"{$.const.PAGE_LNK}?pageid=47", idname:"itemcat_id", url:"{$.php.base_url('inventory/m_itemcat')}", remote: true, required: true }));
	col.push(BSHelper.Checkbox({ horz:false, label:"Is Completed", idname:"is_completed", value:1 }));
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
	var $filter = getURLParameter("filter");
	if ($filter.split('=')[0] == 'movement_id'){
		var movement_id = $filter.split('=')[1];
		$("#request_line_id").shollu_cb({ queryParams: { for_request:1, movement_id:movement_id, having:"qty" } });
		$.getJSON($url_module, { "get_request_id": 1, "movement_id": movement_id }, function(result){ 
			if (result.data.request_id) {
				$("#itemcat_id").shollu_cb("disable", true);
			} else {
				$("#itemcat_id").shollu_cb("disable", false);
			}
		});
	}
	
	$("#request_line_id").shollu_cb({
		onSelect: function(rawData){
			$("#itemcat_id").shollu_cb('setValue', rawData.itemcat_id);
			$("#seq").val(rawData.seq);
			$("#qty").val(rawData.qty);
		}
	});
	
</script>
<script src="{$.const.ASSET_URL}js/window_edit.js"></script>
