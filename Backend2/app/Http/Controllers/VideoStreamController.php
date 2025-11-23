<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoStreamController extends Controller
{
    public function stream(Request $request, $filename) {
        $path = storage_path('app/public/videos/' . $filename);
        if (!file_exists($path)) abort(404);
        $size = filesize($path);
        $start = 0; $end = $size - 1; $length = $size;
        $fp = fopen($path,'rb');
    
        if ($request->headers->has('range')) {
          $range = $request->header('range');
          list(, $range) = explode('=', $range, 2);
          if (strpos($range, ',') !== false) return response('',416);
          if ($range === '-') { $start = $size - intval(substr($range,1)); }
          else {
            $parts = explode('-', $range);
            $start = intval($parts[0]);
            if (isset($parts[1]) && is_numeric($parts[1])) $end = intval($parts[1]);
          }
          $length = $end - $start + 1;
          fseek($fp, $start);
          $status = 206;
        } else { $status = 200; }
    
        $response = new StreamedResponse(function() use ($fp, $length) {
          $buffer = 1024 * 8;
          $bytesSent = 0;
          while (!feof($fp) && $bytesSent < $length) {
            $read = fread($fp, $buffer);
            echo $read;
            flush();
            $bytesSent += strlen($read);
          }
          fclose($fp);
        }, $status);
    
        $response->headers->set('Content-Type','video/mp4');
        $response->headers->set('Accept-Ranges','bytes');
        $response->headers->set('Content-Length',$length);
        if ($status === 206) $response->headers->set('Content-Range',"bytes {$start}-{$end}/{$size}");
        // CORS for dev:
        $response->headers->set('Access-Control-Allow-Origin','http://localhost:5173');
        $response->headers->set('Access-Control-Allow-Credentials','true');
    
        return $response;
      }
}
