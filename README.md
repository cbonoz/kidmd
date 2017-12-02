
#  Kid MD 🇺🇸

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/fact/header._TTH_.png" />

Kid MD is an alexa app designed for helping kids learn about and potentially self-diagnose common medical symptoms.


## How To Use

To use, say 'Alexa, open kid md':

<b>You other responses should be in the following format:</b>

DoctorIntent doctor for {Query} near {City}
DoctorIntent help me with {Query} near {City}
DoctorIntent doctor near {City}
DoctorIntent is there a doctor near {City}
DoctorIntent find a doctor for {Query} near {City}

ProblemIntent I am currently having {Problem}
ProblemIntent I have a {Problem}
ProblemIntent The problem is {Problem}
ProblemIntent My {Relative} is experiencing {Problem}
ProblemIntent My {Relative} currently has {Problem}
ProblemIntent My {Relative} has the {Problem}
ProblemIntent My {Relative} has {Problem}
ProblemIntent My {Relative} has a {Problem}



### Dev Notes

Installing App Dependencies:
```
cd src/ 
npm install
```
Prepare for aws submission (run zip command from /src): 
```
 zip -r -X ../src.zip *
```


### Sample Dialog

'Alexa, open kid md'<br/>
...<br/>
'My son may have a bad flu'<br/>
...<br/>
is there a doctor near boston, massachusetts?<br/>
...<br/>
yes<br/>