<?php

function Pythagorean($sidesArr) {
    if($sidesArr['a'] == ''){
        $asquared = pow($sidesArr['c'],2) - pow($sidesArr['b'],2);
        $sidesArr['a'] = sqrt($asquared);
        var_dump($sidesArr);
        return $sidesArr;
    }elseif($sidesArr['b'] == ''){
       $bsquared = pow($sidesArr['c'],2) - pow($sidesArr['a'],2);
        $sidesArr['b'] = sqrt($bsquared);
        var_dump($sidesArr);
        return $sidesArr; 
    }elseif($sidesArr['c'] == ''){
        $csquared = pow($sidesArr['a'],2) + pow($sidesArr['b'],2);
        $sidesArr['c'] = sqrt($csquared);
        var_dump($sidesArr);
        return $sidesArr;
    }
}


/* Internal Assertions: */
$sidesArr = json_decode('{"a":3,"b":4,"c":""}', true);
$result = json_decode('{"a":3,"b":4,"c":5}', true);
assert(Pythagorean($sidesArr) == $result, 'c is 5');
$sidesArr = json_decode('{"a":8,"b":"","c":10}', true);
$result = json_decode('{"a":8,"b":6,"c":10}', true);
assert(Pythagorean($sidesArr) == $result, 'b is 6');
$sidesArr = json_decode('{"a":"","b":35,"c":37}', true);
$result = json_decode('{"a":12,"b":35,"c":37}', true);
assert(Pythagorean($sidesArr) == $result, 'a is 12');

/* Completion Key */
echo "7eFiB+j80ZJDaCRtw7p1tk0qjRUW5DlD"; 
