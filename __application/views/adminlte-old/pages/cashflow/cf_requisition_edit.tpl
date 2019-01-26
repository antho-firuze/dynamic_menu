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
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/inputmask.date.extensions.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/jquery.inputmask.js"></script>
<script>
	var $url_module = "{$.php.base_url()~$class~'/'~$method}", $bread = {$.php.json_encode($bread)}, $act = getURLParameter("action");
	{* For design form interface *}
	var col = [], row = [];
	var form1 = BSHelper.Form({ autocomplete:"off" });
	var box1 = BSHelper.Box({ type:"info" });
	col.push(BSHelper.Combobox({ horz:false, label:"Branch", label_link:"{$.const.PAGE_LNK}?pageid=18,129&filter=parent_id={$.session.org_id}", idname:"orgtrx_id", textField:"code_name", url:"{$.php.base_url('systems/a_orgtrx_list')}?for_user=1&parent_org_id={$.session.org_id}", remote: true, required: true, disabled: ($act=='edt'?true:false), value: {$.session.orgtrx_id}, hidden: "{$.session.show_branch_entry}"=="1" ? false : true }));
	col.push(BSHelper.Combobox({ horz:false, label:"Planning No", label_link:"{$.const.PAGE_LNK}?pageid=91", textField:"code_name", idname:"request_id", url:"{$.php.base_url('cashflow/cf_request')}?for_requisition=1&act="+$act, remote: true, required: true, disabled: ($act=='edt'?true:false) }));
	col.push(BSHelper.Combobox({ horz:false, label:"Customer", label_link:"{$.const.PAGE_LNK}?pageid=87", idname:"bpartner_id", url:"{$.php.base_url('bpm/c_bpartner')}?filter=is_customer='1'", remote: true, required: true, disabled: true }));
	col.push(BSHelper.Input({ horz:false, type:"date", label:"Planning ETA", idname:"eta_request", cls:"auto_ymd", format:"{$.session.date_format}", required: false, disabled: true }));
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Doc No", idname:"doc_no", format: "'casing': 'upper'", required: true, }));
	col.push(BSHelper.Input({ horz:false, type:"date", label:"Doc Date", idname:"doc_date", cls:"auto_ymd", format:"{$.session.date_format}", required: true }));
	col.push(BSHelper.Input({ horz:false, type:"date", label:"ETA", idname:"eta", cls:"auto_ymd", format:"{$.session.date_format}", required: true, help: "Requisition ETA must be under Planning ETA" }));
	row.push(subCol(6, col)); col = [];
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Reference No", idname:"doc_ref_no", required: false, required: false, }));
	col.push(BSHelper.Input({ horz:false, type:"date", label:"Reference Date", idname:"doc_ref_date", cls:"auto_ymd", format:"{$.session.date_format}", required: false }));
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
	$("#request_id").shollu_cb({
		onSelect: function(rowData){
			$("#bpartner_id").shollu_cb("setValue", rowData.bpartner_id);
			$("#eta_request").val(rowData.eta);
		}
	});
	
</script>
<script src="{$.const.ASSET_URL}js/window_edit.js"></script>
