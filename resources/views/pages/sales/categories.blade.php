<div class="container-fluid pt-3" id="categories">
    <select id="chartStyle" style="width:150px;height:30px">
        <option value="Pie" selected>Pie Chart</option>
        <option value="Donut" >Donut Chart</option>
        <option value="Line">Line Chart</option>
        <option value="Column">Column Chart</option>
    </select>
    <input type="text" id="daterange" style="width:250px">
    <div id="categoriesChart"></div>
</div>
<script src={{asset('/js/sales/category.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>