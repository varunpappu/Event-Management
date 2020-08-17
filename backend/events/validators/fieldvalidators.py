class FieldValidator:

    def __init__(self):
        self.validation_issues = {}

    def field_validations(self, data):
        for key in data:
            if key == 'eventName':
                self.validate_event_name(data[key])

            if key == 'description':
                self.validate_description(data[key])

            if key == 'duration':
                self.validate_duration(data[key])

            if key == 'location':
                self.validate_location(data[key])

            if key == 'fees':
                self.validate_fees(data[key])

            if key == 'tags':
                self.validate_tags(data[key])

            if key == 'maxParticipants':
                self.validate_max_participants(data[key])

        return self.validation_issues

    def validate_event_name(self, data):
        if len(str(data).strip()) < 4:
            self.validation_issues.update({"eventName": "Minimum Characters required is 3"})
        if len(str(data).strip()) > 250:
            self.validation_issues.update({"eventName": "Maximum Characters required is 50"})

    def validate_description(self, data):
        if len(str(data).strip()) < 4:
            self.validation_issues.update({"description": "Enter a valid description"})

    def validate_duration(self, data):
        if not data.isdigit():
            self.validation_issues.update({"duration": "Enter a valid duration"})

    def validate_location(self, data):
        if len(str(data).strip()) < 4:
            self.validation_issues.update({"location": "Enter a valid location"})

    def validate_fees(self, data):
        if not data.isdigit():
            self.validation_issues.update({"fees": "Enter a valid fees"})

    def validate_tags(self, data):
        if len(str(data).strip()) < 4:
            self.validation_issues.update({"tags": "Enter valid tags"})

    def validate_max_participants(self, data):
        if not data.isdigit():
            self.validation_issues.update({"maxParticipants": "Enter a valid number of participants"})
