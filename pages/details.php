<?php
/**
 * @copyright: Copyright 2011 randomland.net.
 * @license:   Apache 2.0; see `license.txt`
 * @author:    zourtney@randomland.net
 * 
 * This file displays the login/settings page.
 */
?>
<!-- *********************************************************************** -->
<!-- Details page templates                                                  -->
<!-- *********************************************************************** -->
<script id="tmpl-details-error" type="text/x-jquery-tmpl">
  <p><strong>Unknown error.</strong></p>
  <p>MobileMiles was unable to connect to the server. Please try again later or
  <a href="<?php echo SYSTEM_ADMIN_URI; ?>" rel="external">contact</a> the system admininstrator.</p>
</script>

<script id="tmpl-details-no-doc" type="text/x-jquery-tmpl">
  <p><strong>No vehicle</strong> or <strong>no entry</strong> specified. Please set your vehicle on the <a href="#list">vehicle list</a> page, then select an entry from the <a href="#view">entry list</a>.</p>
</script>

<script id="tmpl-details" type="text/x-jquery-tmpl">
  <p>Details for fill-up, <abbr class="timeago" title="${datetime}">${datetime}</abbr> at <strong>${location}</strong>.</p>
  <div data-role="collapsible-set">
    <div data-role="collapsible" data-collapsed="false">
      <h3>Fuel Ecomony</h3>
      <p>You got <strong>${mpg} mpg</strong> during this trip.
      </p>
    </div>
    <div data-role="collapsible" data-collapsed="true">
      <h3>Distance and Consumption</h3>
      <p>You traveled <strong>${distance} miles</strong> on <strong>${gallons}</strong> gallons of gasoline during this trip.</p>
    </div>
    <div data-role="collapsible" data-collapsed="true">
      <h3>Time and Location</h3>
      <p>You filled up at <strong>${location}</strong> on <strong>${datetime}</strong>.</p>
    </div>
    <div data-role="collapsible" data-collapsed="true">
      <h3>Cost</h3>
      <p>You spent $<strong>${pumpprice}</strong> at $<strong>${pricepergallon}</strong>/gallon.
      </p>
    </div>
    <div data-role="collapsible" data-collapsed="true">
      <h3>Notes</h3>
      {{if notes}}
        <p>${notes}</p>
      {{else}}
        <p class="disabled">No notes for this fill-up</p>
      {{/if}}
    </div>
  </div>
</script>

<!-- *********************************************************************** -->
<!-- Details page content                                                    -->
<!-- *********************************************************************** -->
<div id="details" data-role="page">
  <?php glHeader(array(
    'title' => 'Details'
  )); ?>
  
  <div data-role="content">
  </div>
  
  <?php glFooter(); ?>
</div>