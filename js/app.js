/**
 * @copyright: Copyright 2011 randomland.net.
 * @license:   Apache 2.0; see `license.txt`
 * @author:    zourtney@randomland.net
 * 
 * Application driver class.
 *
 * TODO: merge everything into a single namespace.
 */


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


/****************************************************************************
 * Generic page
 ****************************************************************************/
var Page = Class.extend({
  init : function(app, id) {
    this.app = app;
    this.id = id;
    this.$page = $('#' + id);
    this.$content = $('#' + id + ' div[data-role="content"]');
    
    var self = this;
    this.$page.live('pageshow', function() {
      self.onPageShow();
    });
  },
  
  showUnauthorized : function(data) {
    $('#tmpl-' + this.id + '-unauthorized')
      .tmpl({
        url: data.url
      })
      .appendTo(this.$content.empty())
    ;
  },
  
  showError : function() {
    $('#tmpl-' + this.id + '-error')
      .tmpl()
      .appendTo(this.$content.empty())
    ;
  },
  
  setSubtitle : function(value) {
    $('.subtitle').text(value);
  }
});


/****************************************************************************
 * Generic page with a list-holding container
 ****************************************************************************/
var PageWithContainer = Page.extend({
  init : function(app, id) {
    this._super(app, id);
    this.$container = $('#' + id + '-container');
    this.needsRefresh = true;
  },
  
  jqmRender : function() {
    // Explicitly create jQuery Mobile objects for newly created HTML elements.
    try {
      //BUG: sometimes this will fail. To reliably reproduce:
      //  1. start at #view
      //  2. ("no document") -> go to doc list, select document
      //  3. fails with `parentPage[0] undefined'
      //
      // Known issue on jQuery Forum:
      //   http://forum.jquery.com/topic/parentpage-0-is-undefined
      //
      // MobileMiles issue #21:
      //   https://github.com/zourtney/mobilemiles/issues/21
      this.$container.find('ul').listview();
      
      this.$container.find('[data-role="button"]').button();
      
      //TODO: add more as needed
    }
    catch (ex) {
      console.log(ex);
    }
  },
  
  showLoading : function() {
    $('#tmpl-' + this.id + '-loading')
      .tmpl()
      .appendTo(this.$container.empty())
    ;
    
    this.jqmRender();
  },
  
  showList : function(data) {
    $('#tmpl-' + this.id + '-show')
      .tmpl(data)
      .appendTo(this.$container.empty())
    ;
    
    this.jqmRender();
  },
  
  onPageShow : function() {
    if (this.needsRefresh) {
      this.populate();
      this.needsRefresh = false;
    }
  }
});


/****************************************************************************
 * Home
 ****************************************************************************/
var HomePage = Page.extend({
  init : function(app) {
    this._super(app, 'home');
  },
  
  showAuthorized : function() {
    $('#tmpl-home')
      .tmpl()
      .appendTo(this.$content.empty())
    ;
    
    this.$content.find('ul').listview();
  },
  
  onPageShow : function() {
    var self = this;
    self.setSubtitle('');
    
    $.ajax({
      url: MobileMilesConst.SCRIPT_URL + 'ajax_login.php',
      dataType: 'json',
      success: function(data) {
        switch (data.response) {
          case 'login_unauthorized':
            self.showUnauthorized(data);
            break;
          case 'login_succeeded':
            self.showAuthorized();
            break;
          default:
            console.log('what is ' + data.response + '?');
            self.showError();
            break;
        }
      },
      error: function(xhr, status, error) {
        console.log('error ' + error + ', ' + status);
        self.showError();
      }
    })
  }
});


/****************************************************************************
 * Settings
 ****************************************************************************/
var SettingsPage = Page.extend({
  init : function(app) {
    this._super(app, 'settings');
  },
  
  showUnauthorized : function(data) {
    $('#tmpl-settings-request')
      .tmpl({
        url: data.url
      })
      .appendTo(this.$content.empty())
    ;
    
    // Suckiness: have to explicitly reconstruct components. I tried
    // using $(#settings [data-role="button"]).page()...and it work the
    // first time, but kills the styling when revisiting a cached page.
    // Hopefully this gets fixed in future versions of jQuery Mobile...
    this.$page.find('[data-role="button"]').button();
    
    //TODO: fix unintuitive 'Back' functionality after authorization.
  },

  showAuthorized : function() {
    $('#tmpl-settings-success')
      .tmpl()
      .appendTo(this.$content.empty())
    ;
    
    // See complaint above.
    this.$page.find('[data-role="button"]').button();
  },
  
  onPageShow : function() {
    var self = this;
    self.setSubtitle('');
    
    $.ajax({
      url: MobileMilesConst.SCRIPT_URL + 'ajax_login.php',
      dataType: 'json',
      data: {
        next: MobileMilesConst.BASE_URL + '#' + self.id
      },
      success: function(data) {
        switch (data.response) {
          case 'login_unauthorized':
            self.showUnauthorized(data);
            break;
          case 'login_succeeded':
            self.showAuthorized();
            break;
          default:
            console.log('what is ' + data.response + '?');
            self.showError();
            break;
        }
      },
      error: function(xhr, status, error) {
        console.log('error: ' + error + ', ' + status);
        self.showError();
      }
    });
  }
});


/******************************************************************************
 * Log out
 ******************************************************************************/
var LogOutPage = Page.extend({
  init : function(app) {
    this._super(app, 'logout');
  },
  
  onPageShow : function() {
    var self = this;
    self.setSubtitle('');
    
    $.ajax({
      url: MobileMilesConst.SCRIPT_URL + 'ajax_login.php?action=logout',
      dataType: 'json',
      success: function(data) {
        switch (data.response) {
          case 'logout_success':
            self.app.list.needsRefresh = true;
            self.app.view.needsRefresh = true;
            
            $.mobile.changePage('#settings');
            break;
          default:
            console.log('what is ' + data.response + '?');
            self.showError();
            break;
        }
      },
      error: function(xhr, status, error) {
        console.log('error: ' + error + ', ' + status);
        self.showError();
      }
    });
  }
});

/****************************************************************************
 * List
 ****************************************************************************/
var ListPage = PageWithContainer.extend({
  init : function(app) {
    this._super(app, 'list');
  
    var self = this;
    $('#ul-list-refresh').live('click', function() {
      self.populate();
      self.app.view.needsRefresh = true;
    });
    
    $('.view-link').live('click', function() {
      var id = $(this).data('id');
      if (id !== undefined && id.length > 0) {
        self.app.doc = id;
        self.app.docTitle = $(this).data('doc-title');
        self.app.view.needsRefresh = true;
      }
    });
  },
  
  populate : function() {
    // Make AJAX call
    var self = this;
    self.setSubtitle('');
    
    $.ajax({
      url: MobileMilesConst.SCRIPT_URL + 'ajax_doclist.php',
      dataType: 'json',
      data: {
        callee: MobileMilesConst.BASE_URL + '#' + self.id
      },
      beforeSend: function() {
        self.showLoading();
      }, // end of 'beforeSend'
      success: function(data) {
        switch (data.response) {
          case 'login_unauthorized':
            self.showUnauthorized(data);
            break;
          case 'doclist_success':
            self.showList({
              docs: data.doclist
            });
            break;
          default:
            console.log('what is ' + data.response + '?');
            self.showError();
            break;
        }
      }, // end of 'success'
      error: function(xhr, status, error) {
        console.log('error: ' + error + ', ' + status);
        self.showError();
      } // end of 'error'
    });
  }
});


/****************************************************************************
 * View
 ****************************************************************************/
var ViewPage = PageWithContainer.extend({
  init : function(app) {
    this._super(app, 'view');
    this.entries = [];
    
    var self = this;
    $('#entrylist li').live('click', function(e) {
      var i = $(this).index() - 1;
      
      if (! isNaN(i) && i > -1 && i < self.entries.length) {
        self.curEntry = self.entries[i];
      }
      else {
        e.preventDefault();
      }
    });
    
    //TODO: touch interface is not perfect...it will fire even if you try to
    // scroll past. But it's better than not working at all!
    $('#entrylist-loadmore').live('click touchend', function() {
      self.populateWithMore();
    });
  },
  
  showNoDoc : function() {
    $('#tmpl-view-no-doc')
      .tmpl()
      .appendTo(this.$content.empty())
    ;
    
    this.setSubtitle('No document');
  },
  
  showLoadMore : function() {
    $('#tmpl-view-loadmore')
      .tmpl()
      .appendTo($('#entrylist-loadmore').empty())
    ;
    
    $('#entrylist').listview('refresh');
  },
  
  showLoadMoreInProgress : function() {
    $('#tmpl-view-loadmore-in-progress')
      .tmpl()
      .appendTo($('#entrylist-loadmore').empty())
    ;
    
    $('#entrylist').listview('refresh');
  },
  
  showListAndAppend : function(data) {
    $('#tmpl-view-item')
      .tmpl(data)
      .insertBefore(this.$container.find('li:last'))
    ;
    
    $('#entrylist').listview('refresh');
  },
  
  populateRange : function(offset, num, callbacks) {
    var self = this;
    $.ajax({
      url: MobileMilesConst.SCRIPT_URL + 'ajax_entrylist.php',
      dataType: 'json',
      data: {
        callee: MobileMilesConst.BASE_URL + '#' + self.id,
        id: self.app.doc,
        offset: offset,
        num: num
      },
      beforeSend: callbacks.beforeSend,
      error: callbacks.error,
      success: callbacks.success,
      complete: function() {
        self.jqmRender();
        
        if (callbacks.complete !== undefined) {
          callbacks.complete();
        }
      }
    });
  },
  
  populate : function() {
    var self = this;
    self.setSubtitle(self.app.docTitle);
    
    self.populateRange(0, 5, {
      beforeSend: function() {
        self.showLoading();
      }, // end of 'beforeSend'
      success: function(data) {
        switch (data.response) {
          case 'login_unauthorized':
            self.showUnauthorized(data);
            break;
          case 'entrylist_no_doc':
            self.showNoDoc();
            break;
          case 'entrylist_success':
            self.entries = data.entrylist;
            
            self.showList({
              entries: self.entries
            });
            break;
          default:
            console.log('what is ' + data.response + '?');
            self.showError();
            break;
        }
      }, // end of 'success'
      error: function(xhr, status, error) {
        console.log('error: ' + status + ', ' + error);
        self.showError();
      } // end of 'error'
    });
  },
  
  populateWithMore : function(num) {
    // Load 10 more, by default
    //TODO: define this magic number elsewhere
    if (num === undefined) {
      num = 10;
    }
    
    var self = this;
    self.populateRange(self.entries.length, num, {
      beforeSend: function() {
        self.showLoadMoreInProgress();
      },
      success: function(data) {
        switch (data.response) {
          case 'login_unauthorized':
            self.showUnauthorized(data);
            break;
          case 'entrylist_success':
            self.entries = self.entries.concat(data.entrylist);
            self.showListAndAppend(data.entrylist);
            break;
          default:
            console.log('what is ' + data.response + '?');
            self.showError();
            break;
        }
      },
      error: function(xhr, status, error) {
        console.log('error: ' + status + ', ' + error);
        self.showError();
      },
      complete: function() {
        self.showLoadMore();
      }
    });
  }
});


/****************************************************************************
 * View Details
 ****************************************************************************/
var ViewDetailsPage = Page.extend({
  init : function(app) {
    this._super(app, 'details');
  },
  
  showNoDoc : function() {
    // Set subtitle
    this.setSubtitle('No document');
    
    // Display error message
    $('#tmpl-details-no-doc')
      .tmpl()
      .appendTo(this.$content.empty())
    ;
  },
  
  showDetails : function(entry) {
    // Set subtitle to document name
    this.setSubtitle(this.app.docTitle);
    
    // Display the template
    $('#tmpl-details')
      .tmpl(entry)
      .appendTo(this.$content.empty())
    ;
    
    // Rebuild collapsible
    $('div [data-role="collapsible"]').collapsible();
  },
  
  onPageShow : function() {
    if (this.app.view.curEntry != null && this.app.view.curEntry !== undefined) {
      this.showDetails(this.app.view.curEntry);
    }
    else {
      this.showNoDoc();
    }
  }
});


/****************************************************************************
 * Add New
 ****************************************************************************/
var AddNewPage = Page.extend({
  init : function(app) {
    this._super(app, 'new');
    
    var self = this;
    
    // Update price estimate when number of gallons is changed
    $('.updateprice').live('change', function() {
      self.updatePrice();
    });
    
    // Click listener for form 'Submit' button. The default way jQuery mobile
    // deals with forms is to AJAX redirect to the current page...we don't
    // want that. We'll just handle the operation ourself, sending the data
    // via AJAX.
    $('.submit').live('click', function() {
      self.submit();
      return false;
    });
  },
  
  showNoDoc : function() {
    this.setSubtitle('No document');
    
    $('#tmpl-new-no-doc')
      .tmpl()
      .appendTo(this.$content.empty())
    ;
  },
  
  showSuccess : function(stats) {
    $('#tmpl-new-success')
      .tmpl(stats)
      .appendTo($('#new > div[data-role="content"]').empty())
    ;
    
    $('div [data-role="collapsible"]').collapsible();
    
    // Scroll to top of page
    this.scrollToField();
  },
  
  showFieldPreloaders : function() {
    $('.preloadable').addClass('ajax-textbox');
  },
  
  removeFieldPreloaders : function() {
    $('.preloadable').removeClass('ajax-textbox');
  },
  
  setFieldFocus : function($field) {
    // Default to the mileage box
    if ($field === undefined || $field == null || $field.length < 1) {
      $field = $('#mileage');
    }
    
    //TODO: fix!
    // BUG: this should work in iOS, but it does not.
    // SEE: http://jsfiddle.net/DLV2F/2/
    //var $mileage = $('#mileage');
    //var len = $mileage.val().length;
    //$mileage
    //  .focus()
    //  .selectRange(len, len)
    //;
    $field.focus();
  },
  
  scrollToField : function($field) {
    var pos = 0;
    if ($field !== undefined && $field != null) {
      var $p = $field.parents('[data-role="fieldcontain"]');
      if ($p.length) {
        pos = $p.offset().top;
        
        //TODO: make sure this is working properly
        this.setFieldFocus($p);
      }
    }
    
    $('html, body').animate({scrollTop: pos}, 100);
  },
  
  updatePrice : function() {
    var estCost = $('#pricepergallon').val() * $('#gallons').val();
    
    if (! isNaN(estCost)) {
      $('#pumpprice').val(getMoney(estCost));
    }
  },
  
  /**
   * Renders the form elements using jQuery Mobile styles. Ugh.
   */
  renderForm : function() {
    // Display the form
    $('#tmpl-new-form')
      .tmpl()
      .appendTo(this.$content.empty())
    ;
    
    // Create jQuery Mobile styled objects
    //TODO: move to jqmRender()
    $('#new div[data-role="fieldcontain"]').fieldcontain();
    $('#new input').textinput();
    $('#new textarea').textinput();
    $('#new select').selectmenu();
    $('#new button').button();
  },
  
  /**
   * Fills the form with the values passed in. The `errors` object contains
   * the IDs of invalid fields; they will be highlighted.
   */
  fillForm : function(data) {
    // Start by setting the current time
    $('#datetime').val(getCurrentTimeString());
    
    // Make sure we were given field data...
    if (data === undefined || data.values === undefined) {
      return;
    }
    
    // Loop through all given fields (overwriting datetime, if needed)
    var $firstInvalid = null;
    
    for (var e in data.values) {
      var $e = $('#' + e);
      
      // Re-fill all values (in case PHP script cleaned them)
      $e.val(data.values[e]);
      
      // Mark all invalid items
      if (data.errors !== undefined && data.errors.hasOwnProperty(e)) {
        //console.log('error on ' + e + ': ' + data.values[e] + ' is invalid.');
        $e.parent().addClass('invalid');
        
        if ($firstInvalid == null) {
          $firstInvalid = $e;
        }
      }
      else {
        $e.parent().removeClass('invalid');
      }
    }
    
    return $firstInvalid;
  },
  
  /**
   * Enable or disable form
   */
  enableForm : function(val) {
    if (val === undefined || val == true) {
      $('#frmNew input, textarea, select').removeAttr('disabled');
      $('#frmNew label').removeClass('disabled');
      $('#submit')
        .button('enable')
        .parent().find('.ui-btn-text').text('Submit')
      ;
    }
    else {
      $('#frmNew input, textarea, select').attr('disabled', 'disabled');
      $('#frmNew label').addClass('disabled');
      $('#submit')
        .button('disable')
        .parent().find('.ui-btn-text').text('Submitting...')
      ;
    }
  },
  
  getFormData : function() {
    var formData = $('#frmNew').serializeArray();
    
    // HACK ------------------------------------------>
    // jQuery not serializing datetime-local field (as of 1.6.2)
    //   https://gist.github.com/1101324
    //TODO: check for updates periodically
    var hasDatetime = false;
    for (var i in formData) {
      if (i == 'datetime') {
        hasDatetime = true;
        break;
      }
    }
    
    if (! hasDatetime) {
      formData.push({name: 'datetime', value: $('#datetime').val()});
    }
    //END HACK <---------------------------------------
    
    // Add the ID field (document key)
    formData.push({name: 'doc', value: mobileMiles.doc});
    
    return formData;
  },
  
  submit : function() {
    var self = this;
    var formData = self.getFormData();
    
    $.ajax({
      url: MobileMilesConst.SCRIPT_URL + 'ajax_new.php',
      dataType: 'json',
      data: formData,
      cache: false,
      beforeSend: function() {
        // Disable the form
        self.enableForm(false);
      },
      success: function(data) {
        switch (data.response) {
          case 'new_validation_error':
            var $firstInvalid = self.fillForm({
              values: data.values,
              errors: data.errors
            });
            
            self.scrollToField($firstInvalid);
            break;
          case 'new_success':
            // Display the stats screen
            self.showSuccess(data.stats);
            
            // Make sure the entry list refreshes if/when they go #view.
            self.app.view.needsRefresh = true;
            break;
          default:
            console.log('what is ' + data.response + '?');
            self.showError();
            break;
        }
      },
      error: function(xhr, status, error) {
        console.log('error: ' + status + ', ' + error);
        self.showError();
      },
      complete: function() {
        // Re-enable the form
        self.enableForm();
      }
    });
  },
  
  onPageShow : function() {
    var self = this;
    
    if (! this.app.isDocValid()) {
      self.showNoDoc();
      return;
    }
    
    // Set document title
    self.setSubtitle(self.app.docTitle);
    
    // Display the form
    self.renderForm();
    
    // Get default values for some of the fields
    $.ajax({
      url: MobileMilesConst.SCRIPT_URL + 'ajax_new.php',
      dataType: 'json',
      data: {
        doc: this.app.doc,
        action: 'defaults'
      },
      cache: false,
      beforeSend: function() {
        self.fillForm();
        self.showFieldPreloaders();
      },
      success: function(data) {
        switch (data.response) {
          case 'new_defaults':
            self.fillForm({
              values: data.values
            });
            break;
          default:
            console.log('what is ' + data.response + '?');
            self.showError();
            break;
        }
      },
      error: function(xhr, status, error) {
        console.log('error: ' + status + ', ' + error);
        self.showError();
      },
      complete: function() {
        self.setFieldFocus();
        self.removeFieldPreloaders();
      }
    });
  },
});


/******************************************************************************
 * MobileMilesApp
 ******************************************************************************/
function MobileMilesApp() {
  // Initialize 'doc' through GET params (if existing)
  if ($_GET.hasOwnProperty('doc') && $_GET['doc'].length > 0) {
    this.doc = $_GET['doc'];
  }
  
  // Returns whether or a document has been set
  this.isDocValid = function() {
    return (this.doc !== undefined && this.doc.length > 0);
  };
  
  var self = this;
  this.init = function() {
    self.home = new HomePage(self);
    self.settings = new SettingsPage(self);
    self.logout = new LogOutPage(self);
    self.list = new ListPage(self);
    self.view = new ViewPage(self);
    self.viewDetails = new ViewDetailsPage(self);
    self.addNew = new AddNewPage(self);
  };
  
  
}; // end of MobileMilesApp

/*****************************************************************************
 * MobileMilesApp instance
 *****************************************************************************/
// Global instance of our application
var mobileMiles = new MobileMilesApp();

$(document).ready(function() {
  // Create manager instances for each page now that the DOM is ready.
  mobileMiles.init();
});