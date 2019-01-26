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
<script>
	var $url_module = "{$.php.base_url()~$class~'/'~$method}", $bread = {$.php.json_encode($bread)};
	{* For design form interface *}
	var col = [], row = [];
	var form1 = BSHelper.Form({ autocomplete:"off" });	
	var box1 = BSHelper.Box({ type:"info" });
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Code", idname:"code", required: false }));
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Name", idname:"name", required: true }));
	col.push(BSHelper.Input({ horz:false, type:"textarea", label:"Description", idname:"description" }));
	col.push(BSHelper.Checkbox({ horz:false, label:"Is Active", idname:"is_active", value:1 }));
	{* col.push(BSHelper.Checkbox({ horz:false, label:"Is Parent", idname:"is_parent", value:0 })); *}
	{* col.push(BSHelper.Combobox({ horz:false, label:"Parent Org", idname:"parent_id", textField:"name_tree", url:"{$.php.base_url('systems/a_org_parent_list')}", remote: true, required: true })); *}
	col.push(BSHelper.Combobox({ horz:false, label:"Org Type", label_link:"{$.const.PAGE_LNK}?pageid=19", idname:"orgtype_id", url:"{$.php.base_url('systems/a_orgtype')}", remote: true, required: true, value: 1, readonly: true }));
	col.push(BSHelper.Combobox({ horz:false, label:"Leader/Supv", label_link:"{$.const.PAGE_LNK}?pageid=20", idname:"supervisor_id", url:"{$.php.base_url('systems/a_user')}", remote: true }));
	row.push(subCol(6, col)); col = [];
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Phone", idname:"phone", required: false }));
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Phone 2", idname:"phone2", required: false }));
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Fax", idname:"fax", required: false }));
	col.push(BSHelper.Input({ horz:false, type:"email", label:"Email", idname:"email", required: false }));
	col.push(BSHelper.Input({ horz:false, type:"text", label:"Website", idname:"website", required: false }));
	row.push(subCol(6, col));
	form1.append(subRow(row));
	form1.append(subRow(subCol()));
	col = [];
	col.push( BSHelper.Button({ type:"submit", label:"Submit", idname:"submit_btn" }) );
	col.push( '&nbsp;&nbsp;&nbsp;' );
	col.push( BSHelper.Button({ type:"button", label:"Cancel", cls:"btn-danger", idname:"btn_cancel", onclick:"window.history.back();" }) );
	form1.append( col );
	box1.find('.box-body').append(form1);
	$(".content").append(box1);

</script>
<script src="{$.const.ASSET_URL}js/window_edit.js"></script>
