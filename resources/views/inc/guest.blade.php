<div class="pb-4">
    <a id="htmlGuest" href="/logout">
        @if(env('APP_SYS') == 'DD')
            <div style="text-align: center;">
                <img class="text-center p-2" src="{{asset('inc/Dunkin.png')}}" style="width: auto; height: 150px;">
            </div>
            <div style="height: 15px; background-color: #e11383"></div>
            <div class="xD" style="text-align: center; height: 90px; line-height: 90px; color: white; font-family: Arial; background-color: #683817; font-size: 40px; font-weight: bold;">
                HEADQUARTERS CONSOLE SYSTEM
            </div>
            <div style="height: 15px; background-color: #f5821f"></div>
        @else
            <div style="text-align: center; background-color: #850708">
                <img class="text-center p-2" src="{{env('APP_URL')}}/inc/MaryGrace.jpg" style="width: auto; height: 150px;">
            </div>
            <div class="xD" style="text-align: center; height: 90px; line-height: 90px; font-family: Arial; color: #850708; background-color: #fbb12d; font-size: 40px; font-weight: bold;">
                HEADQUARTERS CONSOLE SYSTEM
            </div>
        @endif
    </a>
</div>