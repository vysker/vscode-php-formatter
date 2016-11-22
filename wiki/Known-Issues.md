### Extension not working after clean install

If you add Composer to your PATH, make sure to restart ALL of your Visual Studio Code instances afterwards. Visual Studio Code only reads out PATH variables during startup.

### Unable to load dynamic library

If you are on Windows, using xampp, and get the error `PHP Warning: PHP Startup: Unable to load dynamic library`, try going to you xampp directory and run `setup_xampp.bat`. After that, restart Visual Studio Code and try again.

### If I format the whole file, it does work. But if I format a selection, it won't work. Why?
Let's take this example piece of code:

	<?php namespace DoingThings;

	class ThingDoer{
	    private $secret;

	public function doThings($somevar=''){
	    if ($somevar==''){
		$somevar='not the other var';
	    }

	    return $somevar;
	}}

It is formatted horribly. Formatting the whole works here. It will give us this:

    <?php namespace DoingThings;

    class ThingDoer
    {
        private $secret;

        public function doThings($somevar='')
        {
            if ($somevar=='') {
                $somevar='not the other var';
            }

            return $somevar;
        }
    }

Great! But what if I only select the function (and its body) called `doThings` and try to format that? Well, two things happen. First, the VSCode application takes the selected code and passes it to the PHP-CS-Fixer. Second, the PHP-CS-Fixer takes a look at the code, and notices a syntax error: a function **outside a class** with the `public` visibility modifier. That's not right. So it won't fix it. But when it fixed the file as a whole, PHP-CS-Fixer sees the context of the function, and knows that it can use the `public` modifier, because the function is _inside_ a class. Without that context, it doesn't know about the wrapping class, so it will assert a syntax error and nothing happens.

### My code won't format; does the extension even work?
Be aware that if your code has any syntax errors, PHP-CS-Fixer will not be able to format it.

A lot of issues also stem from incorrect installation of the PHP-CS-Fixer, see [their repo](https://github.com/FriendsOfPHP/PHP-CS-Fixer#installation) for more info. Try using the fixer without VSCode and see if any issues pop up.

If your installation is working, check to see if your `level` or `fixers` settings are properly configured. The PHP-CS-Fixer repo has a great section on the [use of settings](https://github.com/FriendsOfPHP/PHP-CS-Fixer#usage). If that doesn't work, try enabling the `phpformatter.logging` setting and check the developer console for debugging information. If that doesn't help either, feel free to open an issue on the repo.