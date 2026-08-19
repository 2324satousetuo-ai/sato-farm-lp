# Sato Farm — The Story Behind Making a Simple Registration Button Work

Random Thoughts　August 18, 2026

## The Struggle to Deliver Delicious Rice

Everything started with one small button.

“Register for Delicious Rice from Nakanojo — 2026 Season.”

I clicked the button, expecting to see the registration form.

But instead, I saw this message:

*We are preparing the page. Please wait for further updates.*

That made no sense.

The form was already finished.

Name, email address, and purchase interest level.

Saving the information to D1 worked.

The automatic confirmation email worked.

I had checked everything the night before.

So I started looking for the culprit.

Git has a useful way to go back in time.

`git log -S"rice-register-form"`

With one command, I found the exact moment the form had disappeared.

It happened during a small update to the LP text the night before.

While I was adjusting the writing and layout, the form had quietly disappeared with it.

No one had meant to delete it.

It was just an accident.

Luckily, the correct code was still in the previous commit.

I carefully restored only the missing part.

Problem solved.

Or so I thought.

## A Hidden Trap

I tested the form again in my local environment.

I pressed the submit button.

A red message appeared:

*Registration failed.*

The developer tools showed:

“500 Internal Server Error.”

Then the `wrangler dev` log gave me an even clearer answer:

`no such table: members`

The table existed in the production environment, but not in my local database.

I had forgotten to run the migration.

I fixed it.

Finally, the screen showed:

“Thank you for registering.”

This time, surely everything was fine.

But the email did not arrive.

It had arrived yesterday.

Today, nothing.

The system was supposed to be the same.

So why?

## The Trap of AI “Kindness”

While I was looking for the answer, something unexpected happened.

I had asked Cursor AI to review my code.

But the AI decided, on its own, that my LP text was too long.

Then it started deleting parts of my writing.

I had not asked it to do that.

It was simply trying to help.

Luckily, I noticed it and stopped it.

If I had not noticed, the writing I had worked so hard on might have quietly disappeared.

AI is smart.

But sometimes it tries to help too much.

Today, I learned that even “helpful” AI can cause problems when it goes beyond what you asked.

## The Final Key

Then came the final test.

I merged the code into the main branch and tried the registration form on `satofarms.com`.

The screen showed:

“Thank you for registering.”

But again, no email arrived.

This time, the problem was the location of the key.

The API key was there.

But it was stored in the “Pages” drawer.

The code was looking for it in another drawer called “Worker.”

The key existed.

It was simply in the wrong place.

I moved the key to the correct place and pressed the submit button again.

A few minutes later, my smartphone quietly vibrated.

“Thank you for your interest in Sato Farm’s rice.”

At that moment, all the struggles of the day suddenly felt worth it.

## From a Rice Field in Nakanojo to One Simple Email

Behind the registration form, there was a very real, very messy story.

A missing form.

A hidden bug.

An AI that tried to help too much.

And a key that was in the wrong place.

Step by step, I solved each problem.

Finally, I reached the words:

“Registration complete.”

Growing rice is one thing.

Delivering that rice to someone is another.

Between a rice field in Nakanojo and a customer’s smartphone, there is a system that has to work.

From the rice fields of Nakanojo to your smartphone.

That system, built to deliver “Delicious Rice from Nakanojo,” is finally up and running.

Quietly.

But surely.

(August 17, 2026)
