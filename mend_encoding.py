class MendANSIEncoding:
    def next_token(self):
        self.index += 1

    def get_token(self):        
        return self.str[self.index : self.index + 1]

    def get_double_token(self):
        return self.str[self.index : self.index + 2]

    def has_token(self):
        return self.index < len(self.str)
        
    def mend(self, str):
        self.str = str
        self.index = 0;
        new_str = '';

        while self.has_token():
            if self.get_token() == 'Ã':
                if self.get_double_token() == 'Ã©':
                    new_str += 'é'
                    self.next_token()
                if self.get_double_token() == 'Ãª':
                    new_str += 'ê'
                    self.next_token()
            else:
                new_str += self.get_token()
                    
            self.next_token()

        print(new_str)
        
mend = MendANSIEncoding()
mend.mend("test Ã© test Ãª test")
