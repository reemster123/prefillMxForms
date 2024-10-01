# prefillMxForms
This is a Chrome extension to prefill a Mendix form with your own dummydata based on the given JSON class-value mapping.

# Usecase:
A big percentage of mendix applications exists of forms where a user needs to fill in some of his for example personal information. These forms can exist of multiple pages. If a bug appears on Page 4 or 5, you, as a developer or tester, might get tired of having to fill in all this data (email adresses, phonenumbers, bankaccountNrs, date of birth etc.) on each page each time before you get to the point that you can (re)test the bug/solution. This extension offers functionality to upload a KeyValue JSON array which maps classes of specific fields to values you want to fill in. 

# Set up in following order:
1. Download this package
2. Unzip it and store it somewhere on your computer.
3. Open chrome/extensions
4. See in the left-top-corner the button "Load Unpacked" and navigate to the extension folder and upload it
5. Enable it and pin the extension sothat it is visible in your extensions bar
6. By default the script is set to be triggered for 
7. Click on the extension from the extensions bar. A popup appears with a text area and a button
8. The text area shows a default list of json classes and values that it uses to prefill data.
9. You can adjust this list to fit your mendix form and click refresh. (you should give the mendix input widgets in de modeler the same classes as that you define in this json)
10. If your form exists of multiple pages, add the class "next-button" to the nextpage button in your Mendix app. (there is a slight delay on the filling of data)

Supported widgets:
- textbox
- textarea
- datepicker

Unsupported (because they are easy to fill anyway):
- radiobuttons
- Enumerations


