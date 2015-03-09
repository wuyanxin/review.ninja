import subprocess
import shlex
import os
import sys

proc1 = subprocess.Popen(shlex.split('gulp lint'), stdout = subprocess.PIPE)
proc2 = subprocess.Popen(shlex.split('grep ' + os.getcwd()), stdin = proc1.stdout, stdout = subprocess.PIPE, stderr = subprocess.PIPE)

proc1.stdout.close()
output, err = proc2.communicate()

files_to_strict = filter(lambda x: x != '', output.split('\n'))

for filename in files_to_strict:
	print "adding 'use strict' to " + filename + "..."
	with open(filename, 'r+') as f:
		lines = f.readlines()
		f.seek(0)
		f.write("'use strict';\n")
		f.writelines(lines)
	print "done!"
