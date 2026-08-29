# Sato Farms Rice Direct Sales System Is Ready

August 22, 2026
As the cool autumn wind begins to move across the rice fields, the rice plants slowly begin to sway.

At Sato Farms, another kind of “harvest” was quietly taking shape.

It was a system that would allow us to send our rice directly from the farm to our customers — the **Sato Farms Rice Direct Sales System**.

We simply call it **Direct Sales**.  
Its English name is **Sato Farms Rice Direct Sales System**.

Farm work follows the rhythm of the weather and the seasons.  
This system was created as a tool to help us deliver our rice to customers without disturbing that natural rhythm.

## 1. What the Direct Sales System Is For

The main product is our delicious local rice, **“Sato Rice” (Koshihikari)**, grown here in Nakanojo.

The basic size is 30 kg of brown rice, but we can also offer 20 kg, 15 kg, and 10 kg.

Milled rice is also available as an option.

Shipping costs are calculated automatically based on the actual size of the package and the Japan Post shipping zone.

Payment is by bank transfer only.

We also have five customer levels, from **Level 1 to Level 5**.  
This system can naturally give priority to our regular customers based on their past purchases.

The order page, quotation, order confirmation, and payment confirmation screen are all ready.

We also have A4 documents for the work.  
There is an order confirmation sheet and a work instruction sheet.

Just print them, and they are ready to use for shipping.

## 2. A Management Screen That Fits a Farmer's Life

The management screen was designed not to get in the way of farm work.

At the center is just one button:

**“Payment Confirmed”**

Press this button, and we can move on to the next step.

The system can be used in two ways:

- Use a smartphone for quick work
- Use a PC to handle many orders on busy days

It is a two-way system that fits the life of a farmer.

The management password is made with a word and numbers.

When the system is deployed to Cloudflare D1, the password is registered as an environment variable using `npx wrangler secret put ADMIN_SECRET`.

That is the moment when the password begins to be used.

Doing this kind of work between farm jobs...

A short time ago, I never imagined that I would be doing things like this.

## 3. How Far Have We Come?

The order page, quotation, order confirmation, management screen, and payment confirmation system are all complete.

Worker.js is also ready.

Now, we are waiting to put everything into the live system.

The remaining work is:

D1 production setup.  
Worker production deployment.  
Secret registration.  
Publishing admin.html.

We also need to finish automatic emails and automatic customer-level assignment.

It should all be ready in another day or two.

Farm work has its own time.  
You plant the seeds, wait, and finally harvest.

Building this system was much the same.

We planned it, built it, made mistakes, fixed them, and moved forward one step at a time.

And now, we have finally come this far.

The Direct Sales System is almost ready for its own “harvest” — the moment it begins to work.

Just like the seasons on the farm,

**quietly, steadily, and little by little,  
it is taking shape.**
