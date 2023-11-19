<!DOCTYPE html>
<html class="h-full bg-white" lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Tech Exam</title>
        @vite('resources/css/app.css')
    </head>
    <body class="h-full">
        <div id="app"></div>
        @vite('resources/ts/app.ts')
    </body>
</html>