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
	var col = [], row = [], a = [];
	var form1 = BSHelper.Form({ autocomplete:"off" });
	var box1 = BSHelper.Box({ type:"info" });
	{* col.push(BSHelper.Input({ horz:false, type:"date", label:"Period", idname:"doc_date", cls:"auto_ymd", format:"mm-yyyy", required: true })); *}
	{* col.push(BSHelper.Input({ horz:false, type:"number", label:"Month", idname:"month", style: "text-align: right;", step: "1", min: "1", max: "12", required: true, value: 1, placeholder: "00" })); *}
	a.push(subCol(6, BSHelper.Input({ horz: true, lblsize: "col-sm-4", colsize: "col-sm-8", type:"number", label:"Month", idname:"fmonth", required: true, placeholder:"Month", style: "text-align: right;", step: "1", min: "1", max: "12", required: true, value: 1 })));
	a.push(subCol(6, BSHelper.Input({ horz: true, lblsize: "col-sm-4", colsize: "col-sm-8", type:"number", label:"Year", idname:"fyear", required: true, placeholder:"Year", style: "text-align: right;", step: "1", min: "2010", max: "2019", required: true, value: 2017 })));
	col.push(BSHelper.Label({ horz:false, label:"Period From :", idname:"fperiod", required: true, elcustom:subRow(a) }));
	a = [];
	a.push(subCol(6, BSHelper.Input({ horz: true, lblsize: "col-sm-4", colsize: "col-sm-8", type:"number", label:"Month", idname:"tmonth", required: true, placeholder:"Month", style: "text-align: right;", step: "1", min: "1", max: "12", required: true, value: 12 })));
	a.push(subCol(6, BSHelper.Input({ horz: true, lblsize: "col-sm-4", colsize: "col-sm-8", type:"number", label:"Year", idname:"tyear", required: true, placeholder:"Year", style: "text-align: right;", step: "1", min: "2010", max: "2019", required: true, value: 2017 })));
	col.push(BSHelper.Label({ horz:false, label:"Period To :", idname:"tperiod", required: true, elcustom:subRow(a) }));
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

	{* INITILIZATION *}

</script>
<script src="{$.const.ASSET_URL}js/report.js"></script>
